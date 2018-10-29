// @flow
require('now-env');
import ImgixClient from 'imgix-core-js';

const IS_PROD = process.env.NODE_ENV === 'production';
const LEGACY_PREFIX = 'https://spectrum.imgix.net/';
const EXPIRATION_TIME = 60 * 60 * 10;

// prettier-ignore
const isLocalUpload = (url: string): boolean => url.startsWith('/uploads/', 0) && !IS_PROD
// prettier-ignore
const hasLegacyPrefix = (url: string): boolean => url.startsWith(LEGACY_PREFIX, 0)
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
const stripLegacyPrefix = (url: string): string => url.replace(LEGACY_PREFIX, '')

const signPrimary = (url: string, opts: Object = {}): string => {
  const client = new ImgixClient({
    domains: ['spectrum.imgix.net'],
    secureURLToken: process.env.IMGIX_SECURITY_KEY,
  });
  return client.buildURL(url, opts);
};

const signProxy = (url: string, opts?: any = {}): string => {
  const client = new ImgixClient({
    domains: ['spectrum-proxy.imgix.net'],
    secureURLToken: process.env.IMGIX_PROXY_SECURITY_KEY,
  });
  return client.buildURL(url, opts);
};

type Opts = {
  expires: number,
};

export const signImageUrl = (url: string, opts?: Opts) => {
  if (!url) return null;

  if (isLocalUpload(url)) return url;

  let processedUrl = hasLegacyPrefix(url) ? stripLegacyPrefix(url) : url;

  if (useProxy(url)) return signProxy(processedUrl, opts);
  return signPrimary(processedUrl, opts);
};
