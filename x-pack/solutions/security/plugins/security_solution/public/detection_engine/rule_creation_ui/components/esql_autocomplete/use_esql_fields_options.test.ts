/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { esqlToOptions } from './use_esql_fields_options';

describe('esqlToOptions', () => {
  it('should transform all columns if fieldTYpe is not passed', () => {
    expect(
      esqlToOptions([
        { name: '@timestamp', id: '@timestamp', meta: { type: 'date' } },
        { name: 'agent.build.original', id: 'agent.build.original', meta: { type: 'string' } },
        { name: 'amqp.app-id', id: 'amqp.app-id', meta: { type: 'string' } },
        { name: 'amqp.auto-delete', id: 'amqp.auto-delete', meta: { type: 'number' } },
        { name: 'amqp.class-id', id: 'amqp.class-id', meta: { type: 'boolean' } },
      ])
    ).toEqual([
      { label: '@timestamp' },
      { label: 'agent.build.original' },
      { label: 'amqp.app-id' },
      { label: 'amqp.auto-delete' },
      { label: 'amqp.class-id' },
    ]);
  });
  it('should transform only columns of exact fieldType', () => {
    expect(
      esqlToOptions(
        [
          { name: '@timestamp', id: '@timestamp', meta: { type: 'date' } },
          { name: 'agent.build.original', id: 'agent.build.original', meta: { type: 'string' } },
          { name: 'amqp.app-id', id: 'amqp.app-id', meta: { type: 'string' } },
          { name: 'amqp.auto-delete', id: 'amqp.auto-delete', meta: { type: 'number' } },
          { name: 'amqp.class-id', id: 'amqp.class-id', meta: { type: 'boolean' } },
        ],
        'string'
      )
    ).toEqual([{ label: 'agent.build.original' }, { label: 'amqp.app-id' }]);
  });
});
