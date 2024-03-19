/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import { PluginInitializerContext, CoreSetup, CoreStart, Plugin, Logger } from '@kbn/core/server';

import type { LensServerPluginSetup } from '@kbn/lens-plugin/server';
import { setupQueryExtractionRoute } from './query_extraction';

interface SetupDeps {
  lens: LensServerPluginSetup;
}

export class DashboardQueriesPlugin implements Plugin<{}, {}, SetupDeps> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup, plugins: SetupDeps) {
    this.logger.debug('dashboard queries API: Setup');

    setupQueryExtractionRoute(core, plugins.lens.extractQueries);

    return {};
  }

  public start(core: CoreStart, plugins: object) {
    this.logger.debug('dashboard queries API: Started');
    return {};
  }
}
