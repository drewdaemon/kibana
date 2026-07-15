/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { renderHook } from '@testing-library/react';
import { Subject } from 'rxjs';
import type { Filter } from '@kbn/es-query';
import type { FilterManager } from '@kbn/data-plugin/public';
import type { ToastsStart } from '@kbn/core/public';
import type { DataView } from '@kbn/data-views-plugin/common';
import { useFiltersValidation } from './use_filters_validation';

describe('useFiltersValidation', () => {
  let filterUpdates$: Subject<void>;
  let filterManager: Pick<FilterManager, 'getFilters' | 'getUpdates$'>;
  let toastNotifications: Pick<ToastsStart, 'addWarning'>;
  let adHocDataView: DataView;
  let persistedDataView: DataView;

  beforeEach(() => {
    jest.useFakeTimers();

    filterUpdates$ = new Subject<void>();

    filterManager = {
      getFilters: jest.fn().mockReturnValue([]),
      getUpdates$: jest.fn().mockReturnValue(filterUpdates$),
    };

    toastNotifications = {
      addWarning: jest.fn(),
    };

    adHocDataView = {
      id: 'ad-hoc-id',
      isPersisted: () => false,
    } as unknown as DataView;

    persistedDataView = {
      id: 'persisted-id',
      isPersisted: () => true,
    } as unknown as DataView;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show warning when ad-hoc data view has mismatched filter index', () => {
    const filters: Filter[] = [{ meta: { index: 'different-id' } } as Filter];
    (filterManager.getFilters as jest.Mock).mockReturnValue(filters);

    renderHook(() =>
      useFiltersValidation({
        dataView: adHocDataView,
        filterManager: filterManager as FilterManager,
        toastNotifications: toastNotifications as ToastsStart,
      })
    );

    filterUpdates$.next();
    jest.advanceTimersByTime(500);

    expect(toastNotifications.addWarning).toHaveBeenCalledWith(
      expect.objectContaining({
        'data-test-subj': 'invalidFiltersWarnToast',
      })
    );
  });

  it('should not show warning when data view is persisted', () => {
    const filters: Filter[] = [{ meta: { index: 'different-id' } } as Filter];
    (filterManager.getFilters as jest.Mock).mockReturnValue(filters);

    renderHook(() =>
      useFiltersValidation({
        dataView: persistedDataView,
        filterManager: filterManager as FilterManager,
        toastNotifications: toastNotifications as ToastsStart,
      })
    );

    filterUpdates$.next();
    jest.advanceTimersByTime(500);

    expect(toastNotifications.addWarning).not.toHaveBeenCalled();
  });

  it('should not show warning when all filter indices match data view id', () => {
    const filters: Filter[] = [{ meta: { index: 'ad-hoc-id' } } as Filter];
    (filterManager.getFilters as jest.Mock).mockReturnValue(filters);

    renderHook(() =>
      useFiltersValidation({
        dataView: adHocDataView,
        filterManager: filterManager as FilterManager,
        toastNotifications: toastNotifications as ToastsStart,
      })
    );

    filterUpdates$.next();
    jest.advanceTimersByTime(500);

    expect(toastNotifications.addWarning).not.toHaveBeenCalled();
  });

  it('should not show warning when no filters exist', () => {
    (filterManager.getFilters as jest.Mock).mockReturnValue([]);

    renderHook(() =>
      useFiltersValidation({
        dataView: adHocDataView,
        filterManager: filterManager as FilterManager,
        toastNotifications: toastNotifications as ToastsStart,
      })
    );

    filterUpdates$.next();
    jest.advanceTimersByTime(500);

    expect(toastNotifications.addWarning).not.toHaveBeenCalled();
  });

  it('should unsubscribe on unmount', () => {
    const filters: Filter[] = [{ meta: { index: 'different-id' } } as Filter];
    (filterManager.getFilters as jest.Mock).mockReturnValue(filters);

    const { unmount } = renderHook(() =>
      useFiltersValidation({
        dataView: adHocDataView,
        filterManager: filterManager as FilterManager,
        toastNotifications: toastNotifications as ToastsStart,
      })
    );

    unmount();

    filterUpdates$.next();
    jest.advanceTimersByTime(500);

    expect(toastNotifications.addWarning).not.toHaveBeenCalled();
  });
});
