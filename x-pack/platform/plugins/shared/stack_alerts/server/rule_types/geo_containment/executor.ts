/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { AlertsClientError } from '@kbn/alerting-plugin/server';
import type { StackAlertType } from '../types';
import type { RuleExecutorOptions } from '../../types';
import {
  canSkipBoundariesFetch,
  executeEsQuery,
  getEntitiesAndGenerateAlerts,
  getRecoveredAlertContext,
  getShapeFilters,
  transformResults,
} from './lib';
import type {
  GeoContainmentRuleParams,
  GeoContainmentAlertInstanceState,
  GeoContainmentAlertInstanceContext,
  GeoContainmentRuleState,
} from './types';

import type { ActionGroupId } from './constants';
import { GEO_CONTAINMENT_ID } from './constants';

export async function executor({
  previousStartedAt,
  startedAt: windowEnd,
  services,
  params,
  rule,
  state,
  logger,
}: RuleExecutorOptions<
  GeoContainmentRuleParams,
  GeoContainmentRuleState,
  GeoContainmentAlertInstanceState,
  GeoContainmentAlertInstanceContext,
  typeof ActionGroupId,
  StackAlertType
>): Promise<{ state: GeoContainmentRuleState }> {
  const boundariesRequestMeta = {
    geoField: params.geoField,
    boundaryIndexTitle: params.boundaryIndexTitle,
    boundaryGeoField: params.boundaryGeoField,
    boundaryNameField: params.boundaryNameField,
    boundaryIndexQuery: params.boundaryIndexQuery,
  };

  if (!services.alertsClient) {
    throw new AlertsClientError();
  }

  const { shapesFilters, shapesIdsNamesMap } =
    state.shapesFilters &&
    canSkipBoundariesFetch(boundariesRequestMeta, state.boundariesRequestMeta)
      ? state
      : await getShapeFilters(boundariesRequestMeta, services.scopedClusterClient.asCurrentUser);

  let windowStart = previousStartedAt;
  if (!windowStart) {
    logger.debug(`alert ${GEO_CONTAINMENT_ID}:${rule.id} alert initialized. Collecting data`);
    // Consider making first time window configurable?
    const START_TIME_WINDOW = 1;
    windowStart = new Date(windowEnd);
    windowStart.setMinutes(windowStart.getMinutes() - START_TIME_WINDOW);
  }

  const results = await executeEsQuery(
    params,
    services.scopedClusterClient.asCurrentUser,
    shapesFilters,
    windowStart,
    windowEnd
  );

  const currLocationMap: Map<string, GeoContainmentAlertInstanceState[]> = transformResults(
    results,
    params.dateField,
    params.geoField
  );

  const prevLocationMap: Map<string, GeoContainmentAlertInstanceState[]> = new Map([
    ...Object.entries(
      (state.prevLocationMap as Record<string, GeoContainmentAlertInstanceState[]>) || {}
    ),
  ]);
  const { activeEntities, inactiveEntities } = getEntitiesAndGenerateAlerts(
    prevLocationMap,
    currLocationMap,
    services.alertsClient,
    shapesIdsNamesMap,
    windowEnd
  );

  for (const recoveredAlert of services.alertsClient.getRecoveredAlerts()) {
    const recoveredAlertId = recoveredAlert.alert.getId();
    try {
      const context = getRecoveredAlertContext({
        alertId: recoveredAlertId,
        activeEntities,
        inactiveEntities,
        windowEnd,
      });
      if (context) {
        services.alertsClient?.setAlertData({
          id: recoveredAlertId,
          context,
        });
      }
    } catch (e) {
      logger.warn(`Unable to set alert context for recovered alert, error: ${e.message}`);
    }
  }

  return {
    state: {
      boundariesRequestMeta,
      shapesFilters,
      shapesIdsNamesMap,
      prevLocationMap: Object.fromEntries(activeEntities),
    },
  };
}
