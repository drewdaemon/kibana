/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { BrushEndListener, PartialTheme, SettingsProps, Theme } from '@elastic/charts';
import type { estypes } from '@elastic/elasticsearch';
import type { IUiSettingsClient } from '@kbn/core-ui-settings-browser';
import type { AlertStatus } from '@kbn/rule-data-utils';
import type { ChartsPluginStart } from '@kbn/charts-plugin/public';

export interface Alert {
  key: number;
  doc_count: number;
}

export interface AlertSummaryTimeRange {
  utcFrom: string;
  utcTo: string;
  // fixed_interval condition in ES query such as 1m, 1h, 1d
  fixedInterval: string;
  title?: JSX.Element | string;
  dateFormat?: string;
}

export interface ChartProps {
  themeOverrides?: SettingsProps['theme'];
  onBrushEnd?: BrushEndListener;
}

interface AlertsCount {
  activeAlertCount: number;
  recoveredAlertCount: number;
}

export interface AlertSummaryWidgetDependencies {
  dependencies: {
    charts: ChartsPluginStart;
    uiSettings: IUiSettingsClient;
  };
}

export interface DependencyProps {
  baseTheme: Theme;
  sparklineTheme: PartialTheme;
}

export interface AlertSummaryWidgetProps {
  ruleTypeIds?: string[];
  consumers?: string[];
  filter?: estypes.QueryDslQueryContainer;
  fullSize?: boolean;
  onClick?: (status?: AlertStatus) => void;
  timeRange: AlertSummaryTimeRange;
  chartProps?: ChartProps;
  hideChart?: boolean;
  hideStats?: boolean;
  onLoaded?: (alertsCount?: AlertsCount) => void;
}
