/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

// FROM kibana_sample_data_logs | keep agent.keyword, bytes | stats count(agent.keyword), foo = max(bytes) | limit 200 | WHERE foo > 20

export const profile = {
  drivers: [
    {
      task_description: 'data',
      start_millis: 1739564739055,
      stop_millis: 1739564739057,
      took_nanos: 2253000,
      cpu_nanos: 2148209,
      iterations: 5,
      operators: [
        {
          operator: 'LuceneSourceOperator[maxPageSize = 4228, remainingDocs = 2147469573]',
          status: {
            processed_slices: 1,
            processed_queries: ['*:*'],
            processed_shards: ['.ds-kibana_sample_data_logs-2025.02.10-000001:0'],
            processing_nanos: 146124,
            slice_index: 0,
            total_slices: 1,
            pages_emitted: 4,
            slice_min: 0,
            slice_max: 0,
            current: 2147483647,
            rows_emitted: 14074,
          },
        },
        {
          operator: 'ValuesSourceReaderOperator[fields = [agent.keyword, bytes]]',
          status: {
            readers_built: {
              'agent.keyword:column_at_a_time:BlockDocValuesReader.SingletonOrdinals': 2,
              'bytes:column_at_a_time:BlockDocValuesReader.SingletonLongs': 2,
            },
            process_nanos: 453040,
            pages_processed: 4,
            rows_received: 14074,
            rows_emitted: 14074,
          },
        },
        {
          operator:
            'AggregationOperator[aggregators=[Aggregator[aggregatorFunction=CountAggregatorFunction[channels=[1]], mode=INITIAL], Aggregator[aggregatorFunction=MaxLongAggregatorFunction[channels=[2]], mode=INITIAL]]]',
          status: {
            aggregation_nanos: 1228375,
            aggregation_finish_nanos: 168042,
            pages_processed: 4,
            rows_received: 14074,
            rows_emitted: 1,
          },
        },
        {
          operator: 'ExchangeSinkOperator',
          status: {
            pages_received: 1,
            rows_received: 1,
          },
        },
      ],
      sleeps: {
        counts: {},
        first: [],
        last: [],
      },
    },
    {
      task_description: 'node_reduce',
      start_millis: 1739564739055,
      stop_millis: 1739564739057,
      took_nanos: 2267417,
      cpu_nanos: 35250,
      iterations: 4,
      operators: [
        {
          operator: 'ExchangeSourceOperator',
          status: {
            pages_waiting: 0,
            pages_emitted: 1,
            rows_emitted: 1,
          },
        },
        {
          operator: 'ExchangeSinkOperator',
          status: {
            pages_received: 1,
            rows_received: 1,
          },
        },
      ],
      sleeps: {
        counts: {
          'exchange empty': 2,
        },
        first: [
          {
            reason: 'exchange empty',
            sleep_millis: 1739564739055,
            wake_millis: 1739564739057,
          },
          {
            reason: 'exchange empty',
            sleep_millis: 1739564739057,
            wake_millis: 1739564739057,
          },
        ],
        last: [
          {
            reason: 'exchange empty',
            sleep_millis: 1739564739055,
            wake_millis: 1739564739057,
          },
          {
            reason: 'exchange empty',
            sleep_millis: 1739564739057,
            wake_millis: 1739564739057,
          },
        ],
      },
    },
    {
      task_description: 'final',
      start_millis: 1739564739051,
      stop_millis: 1739564739057,
      took_nanos: 6423417,
      cpu_nanos: 179334,
      iterations: 4,
      operators: [
        {
          operator: 'ExchangeSourceOperator',
          status: {
            pages_waiting: 0,
            pages_emitted: 1,
            rows_emitted: 1,
          },
        },
        {
          operator:
            'AggregationOperator[aggregators=[Aggregator[aggregatorFunction=CountAggregatorFunction[channels=[0, 1]], mode=FINAL], Aggregator[aggregatorFunction=MaxLongAggregatorFunction[channels=[2, 3]], mode=FINAL]]]',
          status: {
            aggregation_nanos: 27084,
            aggregation_finish_nanos: 12167,
            pages_processed: 1,
            rows_received: 1,
            rows_emitted: 1,
          },
        },
        {
          operator: 'ProjectOperator[projection = [0, 1]]',
          status: {
            process_nanos: 1041,
            pages_processed: 1,
            rows_received: 1,
            rows_emitted: 1,
          },
        },
        {
          operator: 'LimitOperator[limit = 199/200]',
          status: {
            limit: 200,
            limit_remaining: 199,
            pages_processed: 1,
            rows_received: 1,
            rows_emitted: 1,
          },
        },
        {
          operator:
            'FilterOperator[evaluator=GreaterThanLongsEvaluator[lhs=Attribute[channel=1], rhs=CastIntToLongEvaluator[v=LiteralsEvaluator[lit=20]]]]',
          status: {
            process_nanos: 95416,
            pages_processed: 1,
            rows_received: 1,
            rows_emitted: 1,
          },
        },
        {
          operator: 'LimitOperator[limit = 199/200]',
          status: {
            limit: 200,
            limit_remaining: 199,
            pages_processed: 1,
            rows_received: 1,
            rows_emitted: 1,
          },
        },
        {
          operator: 'OutputOperator[columns = [count(agent.keyword), foo]]',
        },
      ],
      sleeps: {
        counts: {
          'exchange empty': 2,
        },
        first: [
          {
            reason: 'exchange empty',
            sleep_millis: 1739564739051,
            wake_millis: 1739564739057,
          },
          {
            reason: 'exchange empty',
            sleep_millis: 1739564739057,
            wake_millis: 1739564739057,
          },
        ],
        last: [
          {
            reason: 'exchange empty',
            sleep_millis: 1739564739051,
            wake_millis: 1739564739057,
          },
          {
            reason: 'exchange empty',
            sleep_millis: 1739564739057,
            wake_millis: 1739564739057,
          },
        ],
      },
    },
  ],
};
