/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { useUpdateCases } from './use_bulk_update_case';
import { allCases } from './mock';
import { useToasts } from '../common/lib/kibana';
import * as api from './api';
import { casesQueriesKeys } from './constants';
import { TestProviders, createTestQueryClient } from '../common/mock';

jest.mock('./api');
jest.mock('../common/lib/kibana');

describe('useUpdateCases', () => {
  const addSuccess = jest.fn();
  const addError = jest.fn();

  (useToasts as jest.Mock).mockReturnValue({ addSuccess, addError });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the api when invoked with the correct parameters', async () => {
    const spy = jest.spyOn(api, 'updateCases');
    const { result } = renderHook(() => useUpdateCases(), {
      wrapper: TestProviders,
    });

    act(() => {
      result.current.mutate({ cases: allCases.cases, successToasterTitle: 'Success title' });
    });

    await waitFor(() => expect(spy).toHaveBeenCalledWith({ cases: allCases.cases }));
  });

  it('invalidates the queries correctly', async () => {
    const queryClient = createTestQueryClient();
    const queryClientSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useUpdateCases(), {
      wrapper: (props) => <TestProviders {...props} queryClient={queryClient} />,
    });

    act(() => {
      result.current.mutate({ cases: allCases.cases, successToasterTitle: 'Success title' });
    });

    await waitFor(() => {
      expect(queryClientSpy).toHaveBeenCalledWith(casesQueriesKeys.casesList());
    });

    expect(queryClientSpy).toHaveBeenCalledWith(casesQueriesKeys.tags());
    expect(queryClientSpy).toHaveBeenCalledWith(casesQueriesKeys.userProfiles());
  });

  it('shows a success toaster', async () => {
    const { result } = renderHook(() => useUpdateCases(), {
      wrapper: TestProviders,
    });

    act(() => {
      result.current.mutate({ cases: allCases.cases, successToasterTitle: 'Success title' });
    });

    await waitFor(() =>
      expect(addSuccess).toHaveBeenCalledWith({
        title: 'Success title',
        className: 'eui-textBreakWord',
      })
    );
  });

  it('shows a toast error when the api return an error', async () => {
    jest.spyOn(api, 'updateCases').mockRejectedValue(new Error('useUpdateCases: Test error'));

    const { result } = renderHook(() => useUpdateCases(), {
      wrapper: TestProviders,
    });

    act(() => {
      result.current.mutate({ cases: allCases.cases, successToasterTitle: 'Success title' });
    });

    await waitFor(() => expect(addError).toHaveBeenCalled());
  });
});
