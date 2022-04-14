// @flow
require('now-env');
import ImgixClient from 'imgix-core-js';
import decodeUriComponent from 'decode-uri-component';
import { getDefaultExpires } from './getDefaultExpires';

const IS_PROD = process.env.NODE_ENV === 'production';
export const LEGACY_PREFIX = 'https://spectrum.imgix.net/';

// prettier-ignore
const isLocalUpload = (url: string): boolean => url.startsWith('/uploads/', 0) && !IS_PROD
// prettier-ignore
export const hasLegacyPrefix = (url: string): boolean => url.startsWith(LEGACY_PREFIX, 0)
// prettier-ignore
const useProxy = (url: string): boolean => url.indexOf('spectrum.imgix.net') < 0 && url.startsWith('http', 0)

/*
  When an image is uploaded to s3, we generate a url to be stored in our db
  that looks like: https://spectrum.imgix.net/users/:id/foo.png

  Because we are able to proxy our s3 bucket to imgix, we technically only
  needed to store the '/users/...' path. But since legacy threads and messages
  contain the full url, it must be stripped in order to generate a *new* signed
  url in this utility
*/
// prettier-ignore
export const stripLegacyPrefix = (url: string): string => url.replace(LEGACY_PREFIX, '')

type Opts = {
  expires: ?number,
};

const defaultOpts = {
  expires: getDefaultExpires(),
};

const signPrimary = (url: string, opts: Opts = defaultOpts): string => {
  const client = new ImgixClient({
    domains: 'spectrum.imgix.net',
    secureURLToken: process.env.IMGIX_SECURITY_KEY,
  });
  return client.buildURL(url, opts);
};

const signProxy = (url: string, opts?: Opts = defaultOpts): string => {
  const client = new ImgixClient({
    domains: 'spectrum-proxy.imgix.net',
    secureURLToken: process.env.IMGIX_PROXY_SECURITY_KEY,
  });
  return client.buildURL(url, opts);
};

export const signImageUrl = (url: string, opts: Opts = defaultOpts): string => {
  if (!url) return '';
  if (!opts.expires) {
    opts['expires'] = defaultOpts.expires;
  }

  if (isLocalUpload(url)) return url;

  const processedUrl = hasLegacyPrefix(url) ? stripLegacyPrefix(url) : url;

  try {
    // we never have to worry about escaping or unescaping proxied urls e.g. twitter images
    if (useProxy(url)) return signProxy(processedUrl, opts);
    return signPrimary(processedUrl, opts);
  } catch (err) {
    // if something fails, dont crash the entire frontend, just fail the images
    console.error(err);
    return '';
  }
};
