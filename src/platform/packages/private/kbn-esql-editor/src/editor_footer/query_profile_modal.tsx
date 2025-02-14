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
  EuiFlexItem,
  EuiFlexGroup,
  EuiHorizontalRule,
  useGeneratedHtmlId,
  EuiAccordion,
  EuiIcon,
  EuiTitle,
  EuiTextColor,
} from '@elastic/eui';
import { profile } from './query_profile';

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
        {profile.drivers.map((driver, index) => {
          const TaskComponent = taskMap[driver.task_description];
          return <TaskComponent key={index} {...driver} />;
        })}
        <EuiHorizontalRule margin="s" />
      </EuiModalBody>
      <EuiModalFooter css={{ paddingBlockStart: 0 }}>
        <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" gutterSize="none">
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

const getTaskButtonContent = ({
  name,
  explanation,
  tookTime,
}: {
  name: string;
  explanation: string;
  tookTime: number;
}) => (
  <div>
    <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
      <EuiFlexItem grow={false}>
        <EuiIcon type="index" size="m" />
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiTitle size="xs">
          <h3>{name}</h3>
        </EuiTitle>
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiText size="s">
          <p>
            <EuiTextColor color="subdued">
              {i18n.translate('esql-editor.profile.taskTookTime', {
                defaultMessage: '({tookTime, number, ::.##} milliseconds)',
                values: { tookTime: tookTime / 1e6 },
              })}
            </EuiTextColor>
          </p>
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiText size="s">
      <p>
        <EuiTextColor color="subdued">{explanation}</EuiTextColor>
      </p>
    </EuiText>
  </div>
);

interface TaskData {
  task_description: string;
  took_nanos: number;
  start_millis: number;
  operators: Array<{
    operator: string;
    status?: Record<string, any>;
  }>;
}

function DataTask(props: TaskData) {
  const id = useGeneratedHtmlId({
    prefix: 'taskAccordion',
  });

  return (
    <EuiAccordion
      id={id}
      element="fieldset"
      borders="horizontal"
      buttonProps={{ paddingSize: 'm', css: { width: '100%' } }}
      buttonContent={getTaskButtonContent({
        name: 'Data retrieval',
        explanation: 'Operations related to data retrieval and processing on the data nodes.',
        tookTime: props.took_nanos,
      })}
      paddingSize="l"
    >
      hoody hoo
    </EuiAccordion>
  );
}

function ReduceTask(props: TaskData) {
  const id = useGeneratedHtmlId({
    prefix: 'taskAccordion',
  });

  return (
    <EuiAccordion
      id={id}
      element="fieldset"
      borders="horizontal"
      buttonProps={{ paddingSize: 'm', css: { width: '100%' } }}
      buttonContent={getTaskButtonContent({
        name: 'Data reduce',
        explanation: 'Gathering intermediate query results from the data nodes.',
        tookTime: props.took_nanos,
      })}
      paddingSize="l"
    >
      hoody hoo
    </EuiAccordion>
  );
}

function FinalizeTask(props: TaskData) {
  const id = useGeneratedHtmlId({
    prefix: 'taskAccordion',
  });

  return (
    <EuiAccordion
      id={id}
      element="fieldset"
      borders="horizontal"
      buttonProps={{ paddingSize: 'm', css: { width: '100%' } }}
      buttonContent={getTaskButtonContent({
        name: 'Finalize',
        explanation:
          'Operations which take place on the coordinating node before the results are returned.',
        tookTime: props.took_nanos,
      })}
      paddingSize="l"
    >
      hoody hoo
    </EuiAccordion>
  );
}

const taskMap: Record<string, React.FC<TaskData>> = {
  data: DataTask,
  node_reduce: ReduceTask,
  final: FinalizeTask,
};
