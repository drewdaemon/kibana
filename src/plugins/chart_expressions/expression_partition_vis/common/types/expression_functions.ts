/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import {
  ExpressionFunctionDefinition,
  Datatable,
  ExpressionValueRender,
  ExpressionValueBoxed,
} from '@kbn/expressions-plugin/common';
import { ExpressionValueVisDimension } from '@kbn/visualizations-plugin/common';
import {
  PARTITION_LABELS_VALUE,
  PIE_VIS_EXPRESSION_NAME,
  TREEMAP_VIS_EXPRESSION_NAME,
  MOSAIC_VIS_EXPRESSION_NAME,
  WAFFLE_VIS_EXPRESSION_NAME,
  PARTITION_LAYER_BUCKETS_NAME,
} from '../constants';
import {
  RenderValue,
  PieVisConfig,
  LabelPositions,
  ValueFormats,
  TreemapVisConfig,
  MosaicVisConfig,
  WaffleVisConfig,
} from './expression_renderers';

export interface PartitionLabelsArguments {
  show: boolean;
  position: LabelPositions;
  values: boolean;
  valuesFormat: ValueFormats;
  percentDecimals: number;
  /** @deprecated This field is deprecated and going to be removed in the futher release versions. */
  truncate?: number | null;
  /** @deprecated This field is deprecated and going to be removed in the futher release versions. */
  last_level?: boolean;
}

export type ExpressionValuePartitionLabels = ExpressionValueBoxed<
  typeof PARTITION_LABELS_VALUE,
  {
    show: boolean;
    position: LabelPositions;
    values: boolean;
    valuesFormat: ValueFormats;
    percentDecimals: number;
    /** @deprecated This field is deprecated and going to be removed in the futher release versions. */
    truncate?: number | null;
    /** @deprecated This field is deprecated and going to be removed in the futher release versions. */
    last_level?: boolean;
  }
>;

export interface PartitionLayerBucketArguments {
  metric: ExpressionValueVisDimension | string;
  bucket: ExpressionValueVisDimension | string; // TODO - not sure why the buckets column was considered optional, but preserving for now
}

export type ExpressionValuePartitionLayerBucket = ExpressionValueBoxed<
  'partition_layer_bucket',
  PartitionLayerBucketArguments
>;

export type PartitionLayerBucketExpressionFunctionDefinition = ExpressionFunctionDefinition<
  typeof PARTITION_LAYER_BUCKETS_NAME,
  null,
  PartitionLayerBucketArguments,
  ExpressionValuePartitionLayerBucket
>;

export interface PartitionLayerFieldsArguments {
  fields: Array<ExpressionValueVisDimension | string>;
}

export type ExpressionValuePartitionLayerFields = ExpressionValueBoxed<
  'partition_layer_fields',
  PartitionLayerFieldsArguments
>;

export type PartitionLayerFieldsExpressionFunctionDefinition = ExpressionFunctionDefinition<
  typeof PARTITION_LAYER_BUCKETS_NAME,
  null,
  PartitionLayerFieldsArguments,
  ExpressionValuePartitionLayerFields
>;

export type PieVisExpressionFunctionDefinition = ExpressionFunctionDefinition<
  typeof PIE_VIS_EXPRESSION_NAME,
  Datatable,
  PieVisConfig,
  ExpressionValueRender<RenderValue>
>;

export type TreemapVisExpressionFunctionDefinition = ExpressionFunctionDefinition<
  typeof TREEMAP_VIS_EXPRESSION_NAME,
  Datatable,
  TreemapVisConfig,
  ExpressionValueRender<RenderValue>
>;

export type MosaicVisExpressionFunctionDefinition = ExpressionFunctionDefinition<
  typeof MOSAIC_VIS_EXPRESSION_NAME,
  Datatable,
  MosaicVisConfig,
  ExpressionValueRender<RenderValue>
>;

export type WaffleVisExpressionFunctionDefinition = ExpressionFunctionDefinition<
  typeof WAFFLE_VIS_EXPRESSION_NAME,
  Datatable,
  WaffleVisConfig,
  ExpressionValueRender<RenderValue>
>;

export enum ChartTypes {
  PIE = 'pie',
  DONUT = 'donut',
  TREEMAP = 'treemap',
  MOSAIC = 'mosaic',
  WAFFLE = 'waffle',
}
