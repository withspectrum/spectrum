// @flow

import { addCommunityPageView } from '../../models/pageviews';
import type { PageViewType } from '../../../shared/types';

type AddPageViewInput = {
  id: string,
  refererURL: string,
  pageviewType: PageViewType,
};

export default async (_: any, { input }: { input: AddPageViewInput }) => {
  return true;
};
