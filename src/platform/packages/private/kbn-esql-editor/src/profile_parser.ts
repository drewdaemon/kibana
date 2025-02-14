/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

interface QueryStep {
  name: string;
  took_nanos: number;
  extra_info: Record<string, any>;
}

interface ProfileData {
  drivers: Array<{
    task_description: string;
    took_nanos: number;
    start_millis: number;
    operators: Array<{
      operator: string;
      status?: Record<string, any>;
    }>;
  }>;
}

const OPERATOR_NAME_MAP: Record<string, string> = {
  LuceneSourceOperator: 'raw_document_retrieval',
  ValuesSourceReaderOperator: 'value_extraction',
  AggregationOperator: 'aggregation',
  ExchangeSinkOperator: 'data_transfer',
  ExchangeSourceOperator: 'data_transfer',
  FilterOperator: 'filtering',
  LimitOperator: 'limiting',
  ProjectOperator: 'projection',
  OutputOperator: 'output_generation',
};

export function parseProfileData(profileData: ProfileData): QueryStep[] {
  const steps: QueryStep[] = [];

  for (const driver of profileData.drivers) {
    for (const operator of driver.operators) {
      const operatorKey = Object.keys(OPERATOR_NAME_MAP).find((key) =>
        operator.operator.startsWith(key)
      );
      const name = operatorKey ? OPERATOR_NAME_MAP[operatorKey] : 'unknown_step';

      steps.push({
        name,
        took_nanos: driver.took_nanos,
        extra_info: operator.status || {},
      });
    }
  }

  return steps;
}
