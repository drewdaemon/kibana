/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiText } from '@elastic/eui';
import { uniq } from 'lodash/fp';
import React from 'react';
import styled from 'styled-components';

import { DefaultDraggable } from '../../../../common/components/draggables';
import { EVENT_DURATION_FIELD_NAME } from '../../duration';
import { FormattedDate } from '../../../../common/components/formatted_date';
import { FormattedDuration } from '../../formatted_duration';

export const EVENT_START_FIELD_NAME = 'event.start';
export const EVENT_END_FIELD_NAME = 'event.end';

const TimeIcon = styled(EuiIcon)`
  margin-right: 3px;
  position: relative;
  top: -1px;
`;

TimeIcon.displayName = 'TimeIcon';

/**
 * Renders a column of draggable badges containing:
 * - `event.duration`
 * - `event.start`
 * - `event.end`
 */
export const DurationEventStartEnd = React.memo<{
  contextId: string;
  eventDuration?: string[] | null;
  eventId: string;
  eventEnd?: string[] | null;
  eventStart?: string[] | null;
  scopeId: string;
}>(({ contextId, eventDuration, eventId, eventEnd, eventStart, scopeId }) => (
  <EuiFlexGroup
    alignItems="flexStart"
    data-test-subj="duration-and-start-group"
    direction="column"
    justifyContent="center"
    gutterSize="none"
  >
    {eventDuration != null
      ? uniq(eventDuration).map((duration) => (
          <EuiFlexItem grow={false} key={duration}>
            <DefaultDraggable
              scopeId={scopeId}
              field={EVENT_DURATION_FIELD_NAME}
              id={`duration-event-start-end-default-draggable-${contextId}-${eventId}-${EVENT_DURATION_FIELD_NAME}-${duration}`}
              // @ts-expect-error
              name={name}
              tooltipContent={null}
              value={duration}
            >
              <EuiText size="xs">
                <TimeIcon size="m" type="clock" />
                <FormattedDuration
                  maybeDurationNanoseconds={duration}
                  tooltipTitle={EVENT_DURATION_FIELD_NAME}
                />
              </EuiText>
            </DefaultDraggable>
          </EuiFlexItem>
        ))
      : null}
    {eventStart != null
      ? uniq(eventStart).map((start) => (
          <EuiFlexItem grow={false} key={start}>
            <DefaultDraggable
              scopeId={scopeId}
              field={EVENT_START_FIELD_NAME}
              id={`duration-event-start-end-default-draggable-${contextId}-${eventId}-${EVENT_START_FIELD_NAME}-${start}`}
              tooltipContent={null}
              value={start}
            >
              <EuiText size="xs">
                <TimeIcon size="m" type="clock" />
                <FormattedDate fieldName={EVENT_START_FIELD_NAME} value={start} />
              </EuiText>
            </DefaultDraggable>
          </EuiFlexItem>
        ))
      : null}
    {eventEnd != null
      ? uniq(eventEnd).map((end) => (
          <EuiFlexItem grow={false} key={end}>
            <DefaultDraggable
              scopeId={scopeId}
              field={EVENT_END_FIELD_NAME}
              id={`duration-event-start-end-default-draggable-${contextId}-${eventId}-${EVENT_END_FIELD_NAME}-${end}`}
              tooltipContent={null}
              value={end}
            >
              <EuiText size="xs">
                <TimeIcon size="m" type="clock" />
                <FormattedDate fieldName={EVENT_END_FIELD_NAME} value={end} />
              </EuiText>
            </DefaultDraggable>
          </EuiFlexItem>
        ))
      : null}
  </EuiFlexGroup>
));

DurationEventStartEnd.displayName = 'DurationEventStartEnd';
