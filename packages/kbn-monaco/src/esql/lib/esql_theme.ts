/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { euiThemeVars, darkMode } from '@kbn/ui-theme';
import { ESQLTokenColorRules } from '@kbn/esql-ast';
import { ESQL_TOKEN_POSTFIX } from './constants';
import { monaco } from '../../monaco_imports';

export const buildESQlTheme = (): monaco.editor.IStandaloneThemeData => ({
  base: darkMode ? 'vs-dark' : 'vs',
  inherit: true,
  rules: ESQLTokenColorRules.flatMap((rule) => {
    const { color, tokens, fontStyle } = rule;
    return tokens.map((token) => ({
      token: token + ESQL_TOKEN_POSTFIX,
      foreground: color,
      fontStyle,
    }));
  }),
  colors: {
    'editor.foreground': euiThemeVars.euiTextColor,
    'editor.background': euiThemeVars.euiColorEmptyShade,
    'editor.lineHighlightBackground': euiThemeVars.euiColorLightestShade,
    'editor.lineHighlightBorder': euiThemeVars.euiColorLightestShade,
    'editor.selectionHighlightBackground': euiThemeVars.euiColorLightestShade,
    'editor.selectionHighlightBorder': euiThemeVars.euiColorLightShade,
    'editorSuggestWidget.background': euiThemeVars.euiColorEmptyShade,
    'editorSuggestWidget.border': euiThemeVars.euiColorEmptyShade,
    'editorSuggestWidget.focusHighlightForeground': euiThemeVars.euiColorEmptyShade,
    'editorSuggestWidget.foreground': euiThemeVars.euiTextColor,
    'editorSuggestWidget.highlightForeground': euiThemeVars.euiColorPrimary,
    'editorSuggestWidget.selectedBackground': euiThemeVars.euiColorPrimary,
    'editorSuggestWidget.selectedForeground': euiThemeVars.euiColorEmptyShade,
  },
});
