/* eslint-env jest */
/* global element by */
const { reloadApp } = require('detox-expo-helpers');

describe('Login', () => {
  beforeEach(async () => {
    await device.resetContentAndSettings();
    await reloadApp();
  });

  it('should show the login screen', async () => {
    await expect(element(by.id('login'))).toBeVisible();
  });
});
