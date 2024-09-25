/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { tokenize } from '@kbn/esql-ast';
import { monaco } from '../../monaco_imports';

import { ESQLToken } from './esql_token';
import { ESQLLineTokens } from './esql_line_tokens';
import { ESQLState } from './esql_state';

import { ESQL_TOKEN_POSTFIX } from './constants';

export class ESQLTokensProvider implements monaco.languages.TokensProvider {
  getInitialState(): monaco.languages.IState {
    return new ESQLState();
  }

  tokenize(line: string, prevState: ESQLState): monaco.languages.ILineTokens {
    /**
     * If we see a line that is not the first line and starts with a pipe,
     * we remove the pipe. Otherwise, the lexer will not recognize the command.
     */
    const lineWithoutBeginningPipe =
      prevState.getLineNumber() && line.trimStart()[0] === '|'
        ? line.trimStart().substring(1)
        : line;

    // need to account for the offset of the pipe we removed
    const offsetCorrection =
      lineWithoutBeginningPipe === line ? 0 : line.length - lineWithoutBeginningPipe.length;

    const tokens = tokenize(lineWithoutBeginningPipe).map(
      (token) => new ESQLToken(token.name + ESQL_TOKEN_POSTFIX, token.start + offsetCorrection)
    );

    // @TODO add a token for the pipe we removed

    return new ESQLLineTokens(tokens, prevState.getLineNumber() + 1);
  }
}
