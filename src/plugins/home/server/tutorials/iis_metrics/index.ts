/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { i18n } from '@kbn/i18n';
import { TutorialsCategory } from '../../services/tutorials';
import {
  onPremInstructions,
  cloudInstructions,
  onPremCloudInstructions,
} from '../instructions/metricbeat_instructions';
import {
  TutorialContext,
  TutorialSchema,
} from '../../services/tutorials/lib/tutorials_registry_types';

export function iisMetricsSpecProvider(context: TutorialContext): TutorialSchema {
  const moduleName = 'iis';
  return {
    id: 'iisMetrics',
    name: i18n.translate('home.tutorials.iisMetrics.nameTitle', {
      defaultMessage: 'IIS Metrics',
    }),
    moduleName,
    category: TutorialsCategory.METRICS,
    shortDescription: i18n.translate('home.tutorials.iisMetrics.shortDescription', {
      defaultMessage: 'Collect metrics from IIS HTTP servers with Metricbeat.',
    }),
    longDescription: i18n.translate('home.tutorials.iisMetrics.longDescription', {
      defaultMessage:
        'The `iis` Metricbeat module collects metrics from IIS server and the application pools and websites running. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-iis.html',
      },
    }),
    isBeta: true,
    euiIconType: context.staticAssets.getPluginAssetHref('/logos/iis.svg'),
    artifacts: {
      dashboards: [
        {
          id: 'ebc23240-8572-11ea-91bc-ab084c7ec0e7',
          linkLabel: i18n.translate('home.tutorials.iisMetrics.artifacts.dashboards.linkLabel', {
            defaultMessage: 'IIS metrics dashboard',
          }),
          isOverview: true,
        },
      ],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-iis.html',
      },
    },
    completionTimeMinutes: 10,
    previewImagePath: context.staticAssets.getPluginAssetHref('/iis_metrics/screenshot.webp'),
    onPrem: onPremInstructions(moduleName, context),
    elasticCloud: cloudInstructions(moduleName, context),
    onPremElasticCloud: onPremCloudInstructions(moduleName, context),
    integrationBrowserCategories: ['web', 'observability'],
  };
}
