/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useState, useCallback } from 'react';
import { i18n } from '@kbn/i18n';
import {
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiButtonEmpty,
  EuiText,
  EuiCheckbox,
  EuiFlexItem,
  EuiFlexGroup,
  EuiHorizontalRule,
} from '@elastic/eui';

export function QueryProfileModal({ onClose }: { onClose: () => void }) {
  const [dismissModalChecked, setDismissModalChecked] = useState(false);
  const onTransitionModalDismiss = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDismissModalChecked(e.target.checked);
  }, []);

  return (
    <EuiModal
      onClose={() => onClose()}
      style={{ width: 700 }}
      data-test-subj="discard-starred-query-modal"
    >
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          {i18n.translate('esqlEditor.discardStarredQueryModal.title', {
            defaultMessage: 'Query profile',
          })}
        </EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiText size="m">We gonna do some shizzle here</EuiText>
        <EuiHorizontalRule margin="s" />
      </EuiModalBody>
      <EuiModalFooter css={{ paddingBlockStart: 0 }}>
        <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" gutterSize="none">
          <EuiFlexItem grow={false}>
            <EuiCheckbox
              id="dismiss-discard-starred-query-modal"
              label={i18n.translate('esqlEditor.discardStarredQueryModal.dismissButtonLabel', {
                defaultMessage: "Don't ask me again",
              })}
              checked={dismissModalChecked}
              onChange={onTransitionModalDismiss}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="m">
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  onClick={async () => {
                    await onClose();
                  }}
                  color="primary"
                  data-test-subj="esqlEditor-query-profile-close-btn"
                >
                  {i18n.translate('esqlEditor.queryProfile.closeLabel', {
                    defaultMessage: 'Close',
                  })}
                </EuiButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiModalFooter>
    </EuiModal>
  );
}
