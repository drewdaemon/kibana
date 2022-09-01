/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Datum, PartitionLayer } from '@elastic/charts';
import type { PaletteRegistry } from '@kbn/coloring';
import { FieldFormat } from '@kbn/field-formats-plugin/common';
import type { FieldFormatsStart } from '@kbn/field-formats-plugin/public';
import type { Datatable, DatatableRow } from '@kbn/expressions-plugin/public';
import { getColumnByAccessor } from '@kbn/visualizations-plugin/common/utils';
import {
  BucketColumns,
  ChartTypes,
  ExpressionValuePartitionLayerBucket,
  PartitionVisParams,
} from '../../../common/types';
import { sortPredicateByType } from './sort_predicate';
import { byDataColorPaletteMap, getColor } from './get_color';
import { getNodeLabel } from './get_node_labels';

const EMPTY_SLICE = Symbol('empty_slice');

export const getLayers = (
  chartType: ChartTypes,
  visParams: PartitionVisParams,
  visData: Datatable,
  overwriteColors: { [key: string]: string } = {},
  rows: DatatableRow[],
  palettes: PaletteRegistry | null,
  formatters: Record<string, FieldFormat | undefined>,
  formatter: FieldFormatsStart,
  syncColors: boolean,
  isDarkMode: boolean
): PartitionLayer[] => {
  const fillLabel: PartitionLayer['fillLabel'] = {
    valueFont: {
      fontWeight: 700,
    },
  };

  if (!visParams.labels.values) {
    fillLabel.valueFormatter = () => '';
  }

  // const isSplitChart = Boolean(visParams.dimensions.splitColumn || visParams.dimensions.splitRow);
  // let byDataPalette: ReturnType<typeof byDataColorPaletteMap>;
  // if (!syncColors && columns[1]?.id && palettes && visParams.palette) {
  //   byDataPalette = byDataColorPaletteMap(
  //     rows,
  //     columns[1].id,
  //     palettes?.get(visParams.palette.name),
  //     visParams.palette
  //   );
  // }

  // const sortPredicate = sortPredicateByType(chartType, visParams, visData, columns);
  return visParams.dimensions.partitionLayers.map((partitionLayer, layerIndex) => {
    const layer = partitionLayer as ExpressionValuePartitionLayerBucket;
    const bucketColumn = getColumnByAccessor(layer.bucket, visData.columns)!;

    return {
      groupByRollup: (d: Datum) => {
        const ret = bucketColumn.id ? d[bucketColumn.id] ?? EMPTY_SLICE : bucketColumn.name;
        console.log(ret, d);
        return ret;
      },
      showAccessor: (d: Datum) => d !== EMPTY_SLICE,
      nodeLabel: (d: unknown) => getNodeLabel(d, bucketColumn, formatters, formatter.deserialize),
      fillLabel:
        layerIndex === 0 && chartType === ChartTypes.MOSAIC
          ? { ...fillLabel, minFontSize: 14, maxFontSize: 14, clipText: true }
          : fillLabel,
      // sortPredicate,
      shape: {
        fillColor: (_d) => 'red',
        // getColor(
        //   chartType,
        //   d,
        //   layerIndex,
        //   isSplitChart,
        //   overwriteColors,
        //   columns,
        //   rows,
        //   visParams,
        //   palettes,
        //   byDataPalette,
        //   syncColors,
        //   isDarkMode,
        //   formatter,
        //   col.format
        // ),
      },
    };
  });
};
