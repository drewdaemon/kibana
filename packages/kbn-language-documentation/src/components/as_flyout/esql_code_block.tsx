/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { useEuiTheme } from '@elastic/eui';
import {
  euiCodeBlockCodeStyles,
  euiCodeBlockPreStyles,
} from '@elastic/eui/src/components/code/code_block.styles';
// import { useOverflow } from '@elastic/eui/src/components/code/code_block_overflow';
import React from 'react';

export const ESQLCodeBlock: React.FC = ({ children, ...rest }) => {
  // TODO: Implement overflow handling
  // const { setWrapperRef, tabIndex, overflowHeightStyles } = useOverflow({
  //   overflowHeight,
  // });
  const euiTheme = useEuiTheme();
  const preStyles = euiCodeBlockPreStyles(euiTheme);
  const preProps = {
    className: 'euiCodeBlock__pre',
    css: [
      preStyles.euiCodeBlock__pre,
      preStyles.padding.m,
      // hasControls &&
      //   (isWhiteSpacePre
      //     ? preStyles.whiteSpace.pre.controlsOffset[paddingSize]
      //     : preStyles.whiteSpace.preWrap.controlsOffset[paddingSize]),
    ],
  };

  const codeStyles = euiCodeBlockCodeStyles(euiTheme).euiCodeBlock__code;
  const codeProps = {
    css: codeStyles,
    'data-code-language': 'esql',
    ...rest,
  };
  return (
    <div
    // css={cssStyles}
    // className={classNames('euiCodeBlock', className)}
    // style={overflowHeightStyles}
    >
      <pre {...preProps}>
        <code {...codeProps}>{children}</code>
      </pre>
    </div>
  );
};
