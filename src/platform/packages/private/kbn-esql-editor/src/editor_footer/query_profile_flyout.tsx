/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import {
  EuiButtonEmpty,
  EuiText,
  EuiFlexItem,
  EuiFlexGroup,
  useGeneratedHtmlId,
  EuiAccordion,
  EuiIcon,
  EuiTitle,
  EuiTextColor,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiDescriptionList,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import { profile } from './query_profile';

export function QueryProfileFlyout({ onClose }: { onClose: () => void }) {
  return (
    <EuiFlyout
      onClose={() => onClose()}
      style={{ width: 700 }}
      data-test-subj="discard-starred-query-modal"
    >
      <EuiFlyoutHeader>
        <EuiTitle size="m">
          <h2>
            {i18n.translate('esqlEditor.discardStarredQueryModal.title', {
              defaultMessage: 'Query profile',
            })}
          </h2>
        </EuiTitle>
      </EuiFlyoutHeader>

      <EuiFlyoutBody>
        {profile.drivers.map((driver, index) => {
          const TaskComponent = taskMap[driver.task_description];
          return <TaskComponent key={index} {...driver} />;
        })}
      </EuiFlyoutBody>
      <EuiFlyoutFooter css={{ paddingBlockStart: 0 }}>
        <EuiButtonEmpty
          onClick={() => {
            onClose();
          }}
          color="primary"
          data-test-subj="esqlEditor-query-profile-close-btn"
        >
          {i18n.translate('esqlEditor.queryProfile.closeLabel', {
            defaultMessage: 'Close',
          })}
        </EuiButtonEmpty>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
}

interface TaskData {
  task_description: string;
  took_nanos: number;
  start_millis: number;
  operators: Array<{
    operator: string;
    status?: Record<string, any>;
  }>;
}

const getTaskButtonContent = ({
  name,
  explanation,
  tookTime,
  icon,
}: {
  name: string;
  explanation: string;
  tookTime: number;
  icon: string;
}) => (
  <div>
    <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
      <EuiFlexItem grow={false}>
        <EuiIcon type={icon} size="m" />
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
        icon: 'database',
      })}
      arrowDisplay="right"
      paddingSize="xs"
    >
      <EuiDescriptionList compressed css={{ marginLeft: '40px' }}>
        {props.operators.map((operator, index) => {
          const Component = getOperatorComponent(operator.operator);
          return <Component key={index} status={operator.status!} />;
        })}
      </EuiDescriptionList>
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
        icon: 'indexFlush',
      })}
      arrowDisplay="right"
      paddingSize="xs"
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
        icon: 'check',
      })}
      arrowDisplay="right"
      paddingSize="xs"
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

function LuceneSourceOperator({ status }: { status: Record<string, any> }) {
  return (
    <>
      <EuiDescriptionListTitle>
        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>Lucene source operator</EuiFlexItem>
          <EuiFlexItem>
            <EuiText size="s">
              <p>
                <EuiTextColor color="subdued">
                  {i18n.translate('lolz', {
                    defaultMessage: '({tookTime, number, ::.##} milliseconds)',
                    values: { tookTime: status.processing_nanos / 1e6 },
                  })}
                </EuiTextColor>
              </p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiDescriptionListTitle>
      <EuiDescriptionListDescription>
        <FormattedMessage
          id="esql-editor.profile.luceneSourceOperatorDescription"
          defaultMessage="Retrieved {rows, number} out of {total, number} document IDs from {shardCount, number} {shardCount, plural, one {shard} other {shards}}."
          values={{
            total: status.current,
            rows: status.rows_emitted,
            shardCount: status.processed_shards.length,
          }}
        />
      </EuiDescriptionListDescription>
    </>
  );
}

function ValuesSourceReaderOperator({ status }: { status: Record<string, any> }) {
  return (
    <>
      <EuiDescriptionListTitle>
        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>Values source reader operator</EuiFlexItem>
          <EuiFlexItem>
            <EuiText size="s">
              <p>
                <EuiTextColor color="subdued">
                  {i18n.translate('lolz', {
                    defaultMessage: '({tookTime, number, ::.##} milliseconds)',
                    values: { tookTime: status.process_nanos / 1e6 },
                  })}
                </EuiTextColor>
              </p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiDescriptionListTitle>
      <EuiDescriptionListDescription>
        {i18n.translate('lolz', {
          defaultMessage: 'Retrieved {rows, number} rows from the index.',
          values: { rows: status.rows_emitted },
        })}
      </EuiDescriptionListDescription>
    </>
  );
}
function AggregationOperator({ status }: { status: Record<string, any> }) {
  return (
    <>
      <EuiDescriptionListTitle>
        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>Aggregation operator</EuiFlexItem>
          <EuiFlexItem>
            <EuiText size="s">
              <p>
                <EuiTextColor color="subdued">
                  {i18n.translate('lolz', {
                    defaultMessage: '({tookTime, number, ::.##} milliseconds)',
                    values: {
                      tookTime: (status.aggregation_nanos + status.aggregation_finish_nanos) / 1e6,
                    },
                  })}
                </EuiTextColor>
              </p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiDescriptionListTitle>
      <EuiDescriptionListDescription>
        {i18n.translate('lolz', {
          defaultMessage: 'Performed COUNT and MAX aggregations.',
          values: { rows: status.rows_emitted },
        })}
      </EuiDescriptionListDescription>
    </>
  );
}
function ExchangeSinkOperator({ status }: { status: Record<string, any> }) {
  return (
    <>
      <EuiDescriptionListTitle>Exchange sink operator</EuiDescriptionListTitle>
      <EuiDescriptionListDescription>
        Passes data from one thread to another.
      </EuiDescriptionListDescription>
    </>
  );
}

function getOperatorComponent(operator: string) {
  if (operator.startsWith('LuceneSourceOperator')) {
    return LuceneSourceOperator;
  } else if (operator.startsWith('ValuesSourceReaderOperator')) {
    return ValuesSourceReaderOperator;
  } else if (operator.startsWith('AggregationOperator')) {
    return AggregationOperator;
  }
  return ExchangeSinkOperator;
}
