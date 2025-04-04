/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { HttpSetup } from '@kbn/core/public';
import { DetectionRuleCounter } from './detection_rule_counter';
import { TestProvider } from '../test/test_provider';
import { useFetchDetectionRulesByTags } from '../common/api/use_fetch_detection_rules_by_tags';
import { useFetchDetectionRulesAlertsStatus } from '../common/api/use_fetch_detection_rules_alerts_status';
import type { RuleResponse } from '@kbn/cloud-security-posture-common';

jest.mock('../common/api/use_fetch_detection_rules_by_tags', () => ({
  useFetchDetectionRulesByTags: jest.fn(),
}));
jest.mock('../common/api/use_fetch_detection_rules_alerts_status', () => ({
  useFetchDetectionRulesAlertsStatus: jest.fn(),
}));

const MOCK_TIMEOUT = 100;

describe('DetectionRuleCounter', () => {
  let user: UserEvent;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // Workaround for timeout via https://github.com/testing-library/user-event/issues/833#issuecomment-1171452841
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    jest.restoreAllMocks();
  });
  it('should render loading skeleton when both rules and alerts are loading', () => {
    (useFetchDetectionRulesByTags as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    (useFetchDetectionRulesAlertsStatus as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    const { getByTestId } = render(
      <TestProvider>
        <DetectionRuleCounter tags={['tag1', 'tag2']} createRuleFn={jest.fn()} />
      </TestProvider>
    );

    const skeletonText = getByTestId('csp:detection-rule-counter-loading');
    expect(skeletonText).toBeInTheDocument();
  });

  it('should render create rule link when no rules exist', () => {
    (useFetchDetectionRulesByTags as jest.Mock).mockReturnValue({
      data: { total: 0 },
      isLoading: false,
    });

    (useFetchDetectionRulesAlertsStatus as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    });

    const { getByText, getByTestId } = render(
      <TestProvider>
        <DetectionRuleCounter tags={['tag1', 'tag2']} createRuleFn={jest.fn()} />
      </TestProvider>
    );

    const createRuleLink = getByTestId('csp:findings-flyout-create-detection-rule-link');
    expect(createRuleLink).toBeInTheDocument();
    expect(getByText('Create a detection rule')).toBeInTheDocument();
  });

  it('should render alert and rule count when rules exist', () => {
    (useFetchDetectionRulesByTags as jest.Mock).mockReturnValue({
      data: { total: 5 },
      isLoading: false,
    });

    (useFetchDetectionRulesAlertsStatus as jest.Mock).mockReturnValue({
      data: { total: 10 },
      isLoading: false,
      isFetching: false,
    });

    const { getByText, getByTestId } = render(
      <TestProvider>
        <DetectionRuleCounter tags={['tag1', 'tag2']} createRuleFn={jest.fn()} />
      </TestProvider>
    );

    const alertCountLink = getByTestId('csp:findings-flyout-alert-count');
    const ruleCountLink = getByTestId('csp:findings-flyout-detection-rule-count');

    expect(alertCountLink).toBeInTheDocument();
    expect(getByText(/10 alerts/i)).toBeInTheDocument();
    expect(ruleCountLink).toBeInTheDocument();
    expect(getByText(/5 detection rules/i)).toBeInTheDocument();
  });

  it('should show loading spinner when creating a rule', async () => {
    (useFetchDetectionRulesByTags as jest.Mock).mockReturnValue({
      data: { total: 0 },
      isLoading: false,
    });

    (useFetchDetectionRulesAlertsStatus as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    });
    const createRuleFn = jest.fn(
      (async () =>
        await new Promise((resolve) =>
          setTimeout(() => resolve({ name: 'the-rule-name', id: 'the-rule-id' }), MOCK_TIMEOUT)
        )) as unknown as (http: HttpSetup) => Promise<RuleResponse>
    );

    const { getByTestId, queryByTestId } = render(
      <TestProvider>
        <DetectionRuleCounter tags={['tag1', 'tag2']} createRuleFn={createRuleFn} />
      </TestProvider>
    );

    // Trigger createDetectionRuleOnClick
    const createRuleLink = getByTestId('csp:findings-flyout-create-detection-rule-link');
    await user.click(createRuleLink);

    await waitFor(() => {
      const loadingSpinner = getByTestId('csp:findings-flyout-detection-rule-counter-loading');
      expect(loadingSpinner).toBeInTheDocument();
    });

    jest.advanceTimersByTime(MOCK_TIMEOUT + 10);

    (useFetchDetectionRulesByTags as jest.Mock).mockReturnValue({
      data: { total: 1 },
      isLoading: false,
    });

    (useFetchDetectionRulesAlertsStatus as jest.Mock).mockReturnValue({
      data: { total: 0 },
      isLoading: false,
      isFetching: false,
    });

    // Wait for the loading spinner to disappear
    await waitFor(() => {
      expect(queryByTestId('csp:findings-flyout-detection-rule-counter-loading')).toBeNull();
    });
  });
});
