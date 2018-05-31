// @flow
// A custom method to check whether we're running inside the desktop app or not
// this is necessary because our e2e tests run in Electron (via Cypress), so a simple
// isElectron() check also fires when that's the case
import isElectron from 'is-electron';

export const isDesktopApp = () => {
  return isElectron() && !window.Cypress && window.interop;
};
