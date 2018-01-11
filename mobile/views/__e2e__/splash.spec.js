/* eslint-env jest */
/* global element by */
const { reloadApp } = require('detox-expo-helpers');

describe('Splash', () => {
  beforeEach(async () => {
    await reloadApp();
  });

  it('should have a welcome heading', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });
});
