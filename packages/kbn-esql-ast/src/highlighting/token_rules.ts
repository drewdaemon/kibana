/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */
import { euiThemeVars } from '@kbn/ui-theme';

export const ESQLTokenColorRules = [
  {
    color: euiThemeVars.euiTextColor,
    tokens: [
      'explain',
      'ws',
      'assign',
      'comma',
      'dot',
      'opening_bracket',
      'closing_bracket',
      'quoted_identifier',
      'unquoted_identifier',
      'pipe',
    ],
  },

  // source commands
  {
    color: euiThemeVars.euiColorPrimaryText,
    tokens: ['from', 'row', 'show'],
    fontStyle: 'bold',
  },

  // commands
  {
    color: euiThemeVars.euiColorAccentText,
    fontStyle: 'bold',
    tokens: [
      'dev_metrics',
      'meta',
      'metadata',
      'dev_match',
      'mv_expand',
      'stats',
      'dev_inlinestats',
      'dissect',
      'grok',
      'keep',
      'rename',
      'drop',
      'eval',
      'sort',
      'by',
      'where',
      'not',
      'is',
      'like',
      'rlike',
      'in',
      'as',
      'limit',
      'dev_lookup',
      'null',
      'enrich',
      'on',
      'with',
      'asc',
      'desc',
      'nulls_order',
    ],
  },

  // functions
  { tokens: ['functions'], color: euiThemeVars.euiColorPrimaryText },

  // operators
  {
    color: euiThemeVars.euiColorPrimaryText,
    tokens: [
      'or',
      'and',
      'rp', // ')'
      'lp', // '('
      'eq', // '=='
      'cieq', // '=~'
      'neq', // '!='
      'lt', //  '<'
      'lte', // '<='
      'gt', //  '>'
      'gte', // '>='
      'plus', // '+'
      'minus', // '-'
      'asterisk', // '*'
      'slash', // '/'
      'percent', // '%'
      'cast_op', // '::'
    ],
  },

  // comments
  {
    color: euiThemeVars.euiColorDisabledText,
    tokens: [
      'line_comment',
      'multiline_comment',
      'expr_line_comment',
      'expr_multiline_comment',
      'explain_line_comment',
      'explain_multiline_comment',
      'project_line_comment',
      'project_multiline_comment',
      'rename_line_comment',
      'rename_multiline_comment',
      'from_line_comment',
      'from_multiline_comment',
      'enrich_line_comment',
      'enrich_multiline_comment',
      'mvexpand_line_comment',
      'mvexpand_multiline_comment',
      'enrich_field_line_comment',
      'enrich_field_multiline_comment',
      'lookup_line_comment',
      'lookup_multiline_comment',
      'lookup_field_line_comment',
      'lookup_field_multiline_comment',
      'show_line_comment',
      'show_multiline_comment',
      'meta_line_comment',
      'meta_multiline_comment',
      'setting',
      'setting_line_comment',
      'settting_multiline_comment',
      'metrics_line_comment',
      'metrics_multiline_comment',
      'closing_metrics_line_comment',
      'closing_metrics_multiline_comment',
    ],
  },

  // values
  {
    color: euiThemeVars.euiColorSuccessText,
    tokens: [
      'quoted_string',
      'integer_literal',
      'decimal_literal',
      'named_or_positional_param',
      'param',
      'timespan_literal',
    ],
  },
];
// colors: {
//   'editor.foreground': euiThemeVars.euiTextColor,
//   'editor.background': euiThemeVars.euiColorEmptyShade,
//   'editor.lineHighlightBackground': euiThemeVars.euiColorLightestShade,
//   'editor.lineHighlightBorder': euiThemeVars.euiColorLightestShade,
//   'editor.selectionHighlightBackground': euiThemeVars.euiColorLightestShade,
//   'editor.selectionHighlightBorder': euiThemeVars.euiColorLightShade,
//   'editorSuggestWidget.background': euiThemeVars.euiColorEmptyShade,
//   'editorSuggestWidget.border': euiThemeVars.euiColorEmptyShade,
//   'editorSuggestWidget.focusHighlightForeground': euiThemeVars.euiColorEmptyShade,
//   'editorSuggestWidget.foreground': euiThemeVars.euiTextColor,
//   'editorSuggestWidget.highlightForeground': euiThemeVars.euiColorPrimary,
//   'editorSuggestWidget.selectedBackground': euiThemeVars.euiColorPrimary,
//   'editorSuggestWidget.selectedForeground': euiThemeVars.euiColorEmptyShade,
// },
// });
