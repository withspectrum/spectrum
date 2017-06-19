// @flow
import { URL } from 'url';
const IS_PROD = process.env.NODE_ENV === 'production';
/**
 * Make a URL string is a spectrum.chat URL
 */
export default (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    // hostname might be spectrum.chat or subdomain.spectrum.chat, so we use .endsWith
    // We don't just check .contains because otherwise folks could make spectrum.chat.mydomain.com
    const IS_SPECTRUM_URL = hostname.endsWith('spectrum.chat');
    const IS_LOCALHOST = hostname === 'localhost';
    // Make sure the passed redirect URL is a spectrum.chat one or (in development) localhost
    if (IS_SPECTRUM_URL || (!IS_PROD && IS_LOCALHOST)) {
      return true;
    }
  } catch (err) {
    // Swallow URL parsing errors (when an invalid URL is passed) and redirect to the standard one
    console.log(`Invalid URL ("${url}") passed. Full error:`);
    console.log(err);
  }
  return false;
};
