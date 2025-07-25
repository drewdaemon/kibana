/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { euiBreakpoint, EuiFormLabel, type UseEuiTheme } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import { monaco } from '@kbn/monaco';

import { useKibana } from '@kbn/kibana-react-plugin/public';
import { CodeEditor } from '@kbn/code-editor';
import { css } from '@emotion/react';
import { useMemoCss } from '@kbn/css-utils/public/use_memo_css';
import { suggest, getSuggestion } from './timelion_expression_input_helpers';
import { getArgValueSuggestions } from '../helpers/arg_value_suggestions';
import { ITimelionFunction, TimelionFunctionArgs } from '../../common/types';

const LANGUAGE_ID = 'timelion_expression';
monaco.languages.register({ id: LANGUAGE_ID });

const timelionExpressionInputStyles = {
  base: ({ euiTheme }: UseEuiTheme) =>
    css({
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      marginTop: euiTheme.size.base,
    }),
  editor: (euiThemeContext: UseEuiTheme) =>
    css({
      flex: '1',
      position: 'relative',
      paddingTop: euiThemeContext.euiTheme.size.s,
      [euiBreakpoint(euiThemeContext, ['xs', 's', 'm'])]: {
        flex: 'auto',
        height: ` calc(${euiThemeContext.euiTheme.size.base} * 15)`,
      },
    }),
  absolute: css({
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
};

interface TimelionExpressionInputProps {
  value: string;
  setValue(value: string): void;
}

function TimelionExpressionInput({ value, setValue }: TimelionExpressionInputProps) {
  const styles = useMemoCss(timelionExpressionInputStyles);
  const functionList = useRef<ITimelionFunction[]>([]);
  const kibana = useKibana();
  const argValueSuggestions = useMemo(getArgValueSuggestions, []);

  const provideCompletionItems = useCallback(
    async (model: monaco.editor.ITextModel, position: monaco.Position) => {
      const text = model.getValue();
      const wordUntil = model.getWordUntilPosition(position);
      const wordRange = new monaco.Range(
        position.lineNumber,
        wordUntil.startColumn,
        position.lineNumber,
        wordUntil.endColumn
      );

      const suggestions = await suggest(
        text,
        functionList.current,
        // it's important to offset the cursor position on 1 point left
        // because of PEG parser starts the line with 0, but monaco with 1
        position.column - 1,
        argValueSuggestions
      );

      return {
        suggestions: suggestions
          ? suggestions.list.map((s: ITimelionFunction | TimelionFunctionArgs) =>
              getSuggestion(s, suggestions.type, wordRange)
            )
          : [],
      };
    },
    [argValueSuggestions]
  );

  const provideHover = useCallback(
    async (model: monaco.editor.ITextModel, position: monaco.Position) => {
      const suggestions = await suggest(
        model.getValue(),
        functionList.current,
        // it's important to offset the cursor position on 1 point left
        // because of PEG parser starts the line with 0, but monaco with 1
        position.column - 1,
        argValueSuggestions
      );

      return {
        contents: suggestions
          ? suggestions.list.map((s: ITimelionFunction | TimelionFunctionArgs) => ({
              value: s.help,
            }))
          : [],
      };
    },
    [argValueSuggestions]
  );

  useEffect(() => {
    const abortController = new AbortController();
    if (kibana.services.http) {
      kibana.services.http
        .get<ITimelionFunction[]>('../internal/timelion/functions', {
          signal: abortController.signal,
        })
        .then((data) => {
          functionList.current = data;
        });
    }
    return () => {
      abortController.abort();
    };
  }, [kibana.services.http]);

  return (
    <div css={styles.base}>
      <EuiFormLabel>
        <FormattedMessage id="timelion.vis.expressionLabel" defaultMessage="Timelion expression" />
      </EuiFormLabel>
      <div css={styles.editor}>
        <div data-test-subj="timelionCodeEditor" css={styles.absolute}>
          <CodeEditor
            languageId={LANGUAGE_ID}
            value={value}
            onChange={setValue}
            suggestionProvider={{
              triggerCharacters: ['.', ',', '(', '=', ':'],
              provideCompletionItems,
            }}
            hoverProvider={{ provideHover }}
            options={{
              fixedOverflowWidgets: true,
              fontSize: 14,
              folding: false,
              lineNumbers: 'off',
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false,
              },
              wordWrap: 'on',
              wrappingIndent: 'indent',
            }}
            languageConfiguration={{
              autoClosingPairs: [
                {
                  open: '(',
                  close: ')',
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export { TimelionExpressionInput };
