/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { BehaviorSubject } from 'rxjs';
import type { initializeTitleManager } from '@kbn/presentation-publishing';
import type { ESQLControlVariable } from '@kbn/esql-types';
import { apiPublishesESQLVariables } from '@kbn/esql-types';
import type { DataView } from '@kbn/data-views-plugin/common';
import { createEmptyLensState } from '../helper';
import type {
  ExpressionWrapperProps,
  LensEmbeddableStartServices,
  LensInternalApi,
  LensOverrides,
  LensPanelProps,
  LensRuntimeState,
  VisualizationContext,
} from '../types';
import { apiHasAbortController, apiHasLensComponentProps } from '../type_guards';
import type { UserMessage } from '../../types';

export function initializeInternalApi(
  initialState: LensRuntimeState,
  parentApi: unknown,
  titleManager: ReturnType<typeof initializeTitleManager>,
  { visualizationMap }: LensEmbeddableStartServices
): LensInternalApi {
  const hasRenderCompleted$ = new BehaviorSubject<boolean>(false);
  const expressionParams$ = new BehaviorSubject<ExpressionWrapperProps | null>(null);
  const expressionAbortController$ = new BehaviorSubject<AbortController | undefined>(undefined);
  if (apiHasAbortController(parentApi)) {
    expressionAbortController$.next(parentApi.abortController);
  }
  const renderCount$ = new BehaviorSubject<number>(0);

  const attributes$ = new BehaviorSubject<LensRuntimeState['attributes']>(
    initialState.attributes || createEmptyLensState().attributes
  );
  const overrides$ = new BehaviorSubject(initialState.overrides);
  const disableTriggers$ = new BehaviorSubject(initialState.disableTriggers);
  const dataLoading$ = new BehaviorSubject<boolean | undefined>(undefined);

  const dataViews$ = new BehaviorSubject<DataView[] | undefined>(undefined);
  // This is an internal error state, not to be confused with the runtime error state thrown by the expression pipeline
  // In both cases a blocking error can happen, but for Lens validation errors we want to have full control over the UI
  // while for runtime errors the error will bubble up to the embeddable presentation layer
  const validationMessages$ = new BehaviorSubject<UserMessage[]>([]);
  // This other set of messages is for non-blocking messages that can be displayed in the UI
  const messages$ = new BehaviorSubject<UserMessage[]>([]);

  // This should settle the thing once and for all
  // the isNewPanel won't be serialized so it will be always false after the edit panel closes applying the changes
  const isNewlyCreated$ = new BehaviorSubject<boolean>(initialState.isNewPanel || false);

  const blockingError$ = new BehaviorSubject<Error | undefined>(undefined);
  const visualizationContext$ = new BehaviorSubject<VisualizationContext>({
    // doc can point to a different set of attributes for the visualization
    // i.e. when inline editing or applying a suggestion
    activeAttributes: initialState.attributes,
    mergedSearchContext: {},
    indexPatterns: {},
    indexPatternRefs: [],
    activeVisualizationState: undefined,
    activeDatasourceState: undefined,
    activeData: undefined,
  });

  const esqlVariables$ = apiPublishesESQLVariables(parentApi)
    ? parentApi.esqlVariables$
    : new BehaviorSubject<ESQLControlVariable[]>([]);

  // No need to expose anything at public API right now, that would happen later on
  // where each initializer will pick what it needs and publish it
  return {
    attributes$,
    overrides$,
    disableTriggers$,
    esqlVariables$,
    dataLoading$,
    hasRenderCompleted$,
    expressionParams$,
    expressionAbortController$,
    renderCount$,
    isNewlyCreated$,
    dataViews$,
    blockingError$,
    messages$,
    validationMessages$,
    dispatchError: () => {
      hasRenderCompleted$.next(true);
      renderCount$.next(renderCount$.getValue() + 1);
    },
    dispatchRenderStart: () => hasRenderCompleted$.next(false),
    dispatchRenderComplete: () => {
      performance.mark('render_complete_competitive');
      renderCount$.next(renderCount$.getValue() + 1);
      hasRenderCompleted$.next(true);

      try {
        printMetrics(
          'Fine-grained performance',
          [
            'time_to_navigate',
            'time_until_embeddable_factory_requested',
            'time_until_embeddable_requested',
            'time_until_embeddable_executes_expression',
            'time_to_requester_fn',
            'time_until_data_request',
            'time_to_data',
            'time_to_charts_lib',
            'time_in_charts_lib',
          ],
          [
            'navigate_to_dashboard',
            'dashboard_render_initiated',
            'embeddable_factory_requested',
            'embeddable_requested',
            'expression_sent_to_engine',
            'requester_fn',
            'search_initiated',
            'search_response_received',
            'charts_lib_invoked',
            'render_complete',
          ]
        );
      } catch {
        // do nothing if performance API fails
      }

      try {
        printMetrics(
          'Competitive performance',
          ['data_requested_competitive', 'data_received_competitive', 'chart_drawn_competitive'],
          [
            'navigation_start_competitive',
            'data_requested_competitive',
            'data_received_competitive',
            'render_complete_competitive',
          ]
        );
      } catch {
        // do nothing if performance API fails
      }
    },
    updateExpressionParams: (newParams: ExpressionWrapperProps | null) =>
      expressionParams$.next(newParams),
    updateDataLoading: (newDataLoading: boolean | undefined) => dataLoading$.next(newDataLoading),
    updateOverrides: (overrides: LensOverrides['overrides']) => overrides$.next(overrides),
    updateAttributes: (attributes: LensRuntimeState['attributes']) => attributes$.next(attributes),
    updateAbortController: (abortController: AbortController | undefined) =>
      expressionAbortController$.next(abortController),
    updateDisabledTriggers: (disableTriggers: LensPanelProps['disableTriggers']) =>
      disableTriggers$.next(disableTriggers),
    updateDataViews: (dataViews: DataView[] | undefined) => dataViews$.next(dataViews),
    updateMessages: (newMessages: UserMessage[]) => messages$.next(newMessages),
    updateValidationMessages: (newMessages: UserMessage[]) => validationMessages$.next(newMessages),
    resetAllMessages: () => {
      messages$.next([]);
      validationMessages$.next([]);
    },
    updateBlockingError: (blockingError: Error | undefined) => blockingError$.next(blockingError),
    setAsCreated: () => isNewlyCreated$.next(false),
    getDisplayOptions: () => {
      const latestAttributes = attributes$.getValue();
      if (!latestAttributes.visualizationType) {
        return {};
      }

      let displayOptions =
        visualizationMap[latestAttributes.visualizationType]?.getDisplayOptions?.() ?? {};

      if (apiHasLensComponentProps(parentApi) && parentApi.noPadding != null) {
        displayOptions = {
          ...displayOptions,
          noPadding: parentApi.noPadding,
        };
      }

      if (displayOptions.noPanelTitle == null && titleManager.api.hideTitle$?.getValue()) {
        displayOptions = {
          ...displayOptions,
          noPanelTitle: true,
        };
      }

      return displayOptions;
    },
    getVisualizationContext: () => visualizationContext$.getValue(),
    updateVisualizationContext: (newVisualizationContext: Partial<VisualizationContext>) => {
      visualizationContext$.next({
        ...visualizationContext$.getValue(),
        ...newVisualizationContext,
      });
    },
  };
}

const printMetrics = (title: string, measureNames: string[], marks: string[]) => {
  for (let i = 0; i < marks.length - 1; i++) {
    performance.measure(measureNames[i], marks[i], marks[i + 1]);
  }

  performance.measure('total', marks[0], marks[marks.length - 1]);

  // log them

  const measures = measureNames
    .map((name) => performance.getEntriesByName(name, 'measure'))
    .flat()
    .sort((a, b) => {
      // Keep "total" measure at the end
      if (a.name === 'total') return 1;
      if (b.name === 'total') return -1;
      return a.startTime - b.startTime;
    });

  let totalTime = 0;
  for (const measure of measures) {
    totalTime += measure.duration;
  }

  // Print performance data in TSV format for Google Sheets
  let tsvOutput = '';
  for (let i = 0; i < measures.length; i++) {
    const measure = measures[i];
    const percentage = totalTime > 0 ? ((measure.duration / totalTime) * 100).toFixed(1) : '0.0';
    tsvOutput += `${measure.name}\t${measure.duration.toFixed(2)}\t${percentage}\n`;
  }

  console.log(`${title} TSV:\nMeasure\tDuration (ms)\tPercentage\n${tsvOutput}`);

  marks.map((mark) => performance.clearMarks(mark));
  measureNames.map((measure) => performance.clearMeasures(measure));
  performance.clearMarks('total');
};
