// @flow
// A custom method to check whether we're running inside the desktop app or not
// this is necessary because our e2e tests run in Electron (via Cypress), so a simple
// isElectron() check also fires when that's the case
import isElectron from 'is-electron';
import { getItemFromStorage, storeItem } from 'src/helpers/localStorage';

export const isDesktopApp = () => {
  return isElectron() && !window.Cypress && window.interop;
};

const DESKTOP_UPSELL_LS_KEY = 'dismissed-desktop-app-upsell';

export const hasDismissedDesktopAppUpsell = () => {
  return getItemFromStorage(DESKTOP_UPSELL_LS_KEY);
};

export const dismissDesktopAppUpsell = () => {
  return storeItem(DESKTOP_UPSELL_LS_KEY, true);
};

export const DESKTOP_APP_MAC_URL =
  'https://github.com/withspectrum/spectrum/releases/download/v1.0.5/Spectrum-1.0.5.dmg';
