/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { i18n } from '@kbn/i18n';
import { suggest } from './suggest';
import { CommandDefinition } from '../../types';

export const definition: CommandDefinition<'join'> = {
  name: 'join',
  types: [
    {
      name: 'lookup',
      description: i18n.translate(
        'kbn-esql-validation-autocomplete.esql.definitions.joinLookupDoc',
        {
          defaultMessage: 'Join with a "lookup" mode index',
        }
      ),
    },
  ],
  description: i18n.translate('kbn-esql-validation-autocomplete.esql.definitions.joinDoc', {
    defaultMessage: 'Join table with another table.',
  }),
  declaration: `LOOKUP JOIN <lookup_index> ON <field_name>`,
  preview: true,
  examples: ['… | LOOKUP JOIN lookup_index ON join_field'],
  suggest,
};
