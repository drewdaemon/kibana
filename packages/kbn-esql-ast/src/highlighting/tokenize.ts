/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { CharStreams, Token } from 'antlr4';
import { ESQLErrorListener } from '../antlr_error_listener';
import { getLexer } from '../antlr_facade';

const EOF = -1;

interface NamedToken {
  name: string;
  start: number;
}

export const tokenize = (code: string) => {
  const errorListener = new ESQLErrorListener();
  const inputStream = CharStreams.fromString(code);
  const lexer = getLexer(inputStream, errorListener);

  let done = false;
  const tokens: NamedToken[] = [];

  do {
    let token: Token | null = null;
    try {
      token = lexer.nextToken();
    } catch (e) {
      done = true;
    }

    if (token == null) {
      done = true;
    } else {
      if (token.type === EOF) {
        done = true;
      } else {
        const tokenTypeName = lexer.symbolicNames[token.type];

        if (tokenTypeName) {
          tokens.push({ name: tokenTypeName, start: token.start });
        }
      }
    }
  } while (!done);

  // for (const e of errorStartingPoints) {
  //   myTokens.push(new ESQLToken('error', e));
  // }

  tokens.sort((a, b) => a.start - b.start);

  // // special treatment for functions
  // // the previous custom Kibana grammar baked functions directly as tokens, so highlight was easier
  // // The ES grammar doesn't have the token concept of "function"
  // const tokensWithFunctions = addFunctionTokens(myTokens);
  // mergeTokens(tokensWithFunctions);

  return tokens;
};
