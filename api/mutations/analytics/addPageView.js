// @flow

import { parse as parseURL } from 'url';
import { addPageView } from '../../models/pageviews';
import type { PageViewType } from '../../../shared/types';

type AddPageViewInput = {
  id: string,
  refererURL?: string,
  pageviewType: PageViewType,
};

/**
 * Takes a URL like https://www.github.com or www.spectrum.chat
 * and returns github.com and spectrum.chat respectively
 *
 * NOTE: For domains with non www subdomain, it keeps the subdomain
 */
function getCleanHostName(url?: string): string | void {
  if (!url) return undefined;
  const parsedURL = parseURL(url);
  if (!parsedURL.hostname) return undefined;
  const longHostname = parsedURL.hostname;
  // removes www. from the front of a hostname
  return longHostname.replace(/^www\./, '');
}

export default async (_: any, { input }: { input: AddPageViewInput }) => {
  const hostname = getCleanHostName(input.refererURL);
  return addPageView({
    id: input.id,
    refererDomain: hostname,
    pageviewType: input.pageviewType,
  });
};
