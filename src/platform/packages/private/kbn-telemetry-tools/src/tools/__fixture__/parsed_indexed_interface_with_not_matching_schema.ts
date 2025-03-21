/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { SyntaxKind } from 'typescript';
import { ParsedUsageCollection } from '../ts_parser';

export const parsedIndexedInterfaceWithNoMatchingSchema: ParsedUsageCollection = [
  'src/platform/packages/private/kbn-telemetry-tools/src/tools/__fixture__/telemetry_collectors/indexed_interface_with_not_matching_schema.ts',
  {
    collectorName: 'indexed_interface_with_not_matching_schema',
    schema: {
      value: {
        something: {
          count_1: {
            type: 'long',
          },
        },
      },
    },
    fetch: {
      typeName: 'Usage',
      typeDescriptor: {
        '@@INDEX@@': {
          count_1: {
            kind: SyntaxKind.NumberKeyword,
            type: 'NumberKeyword',
          },
          count_2: {
            kind: SyntaxKind.NumberKeyword,
            type: 'NumberKeyword',
          },
        },
      },
    },
  },
];
