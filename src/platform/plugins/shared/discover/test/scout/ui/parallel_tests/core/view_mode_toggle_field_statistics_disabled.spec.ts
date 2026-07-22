/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { expect } from '@kbn/scout/ui';
import { spaceTest } from '../../fixtures/common';

spaceTest.describe(
  'Discover view mode toggle with field statistics disabled',
  { tag: '@local-stateful-classic' },
  () => {
    spaceTest.beforeAll(async ({ discoverScoutSpace }) => {
      await discoverScoutSpace.setupDiscoverDefaults();
      await discoverScoutSpace.uiSettings.set({ 'discover:showFieldStatistics': false });
    });

    spaceTest.beforeEach(async ({ browserAuth, pageObjects }) => {
      await browserAuth.loginAsViewer();
      await pageObjects.discover.goto({ queryMode: 'classic' });
      await pageObjects.dataGrid.waitForLoad();
    });

    spaceTest.afterAll(async ({ discoverScoutSpace }) => {
      await discoverScoutSpace.uiSettings.unset('discover:showFieldStatistics');
      await discoverScoutSpace.teardownDiscoverDefaults();
    });

    spaceTest('should not show Field Statistics tab', async ({ page }) => {
      await expect(page.testSubj.locator('dscViewModeToggle')).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Field statistics' })).toHaveCount(0);
    });
  }
);
