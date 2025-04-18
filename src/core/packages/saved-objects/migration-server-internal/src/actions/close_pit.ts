/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import * as Either from 'fp-ts/Either';
import * as TaskEither from 'fp-ts/TaskEither';
import type { ElasticsearchClient } from '@kbn/core-elasticsearch-server';
import {
  catchRetryableEsClientErrors,
  type RetryableEsClientError,
} from './catch_retryable_es_client_errors';

/** @internal */
export interface ClosePitParams {
  client: ElasticsearchClient;
  pitId: string;
}
/*
 * Closes PIT.
 * See https://www.elastic.co/guide/en/elasticsearch/reference/current/point-in-time-api.html
 * */
export const closePit =
  ({ client, pitId }: ClosePitParams): TaskEither.TaskEither<RetryableEsClientError, {}> =>
  () => {
    return client
      .closePointInTime({ id: pitId })
      .then((response) => {
        if (!response.succeeded) {
          throw new Error(`Failed to close PointInTime with id: ${pitId}`);
        }
        return Either.right({});
      })
      .catch(catchRetryableEsClientErrors);
  };
