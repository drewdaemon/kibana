/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ExceptionsListPreExportServerExtension } from '@kbn/lists-plugin/server';
import type { EndpointAppContextService } from '../../../endpoint/endpoint_app_context_services';
import {
  BlocklistValidator,
  EndpointExceptionsValidator,
  EventFilterValidator,
  HostIsolationExceptionsValidator,
  TrustedAppValidator,
} from '../validators';

export const getExceptionsPreExportHandler = (
  endpointAppContextService: EndpointAppContextService
): ExceptionsListPreExportServerExtension['callback'] => {
  return async function ({ data, context: { request, exceptionListClient } }) {
    if (data.namespaceType !== 'agnostic') {
      return data;
    }

    const { listId: maybeListId, id } = data;
    let listId: string | null | undefined = maybeListId;

    if (!listId && id) {
      listId = (await exceptionListClient.getExceptionList(data))?.list_id ?? null;
    }

    if (!listId) {
      return data;
    }

    // Validate Trusted Applications
    if (TrustedAppValidator.isTrustedApp({ listId })) {
      await new TrustedAppValidator(endpointAppContextService, request).validatePreExport();
      return data;
    }

    // Host Isolation Exceptions validations
    if (HostIsolationExceptionsValidator.isHostIsolationException({ listId })) {
      await new HostIsolationExceptionsValidator(
        endpointAppContextService,
        request
      ).validatePreExport();
      return data;
    }

    // Event Filter validations
    if (EventFilterValidator.isEventFilter({ listId })) {
      await new EventFilterValidator(endpointAppContextService, request).validatePreExport();
      return data;
    }

    // Validate Blocklists
    if (BlocklistValidator.isBlocklist({ listId })) {
      await new BlocklistValidator(endpointAppContextService, request).validatePreExport();
      return data;
    }

    // Validate Endpoint Exceptions
    if (EndpointExceptionsValidator.isEndpointException({ listId })) {
      await new EndpointExceptionsValidator(endpointAppContextService, request).validatePreExport();
      return data;
    }

    return data;
  };
};
