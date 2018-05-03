// @flow

import { addCommunityPageView } from '../../models/pageview';

type AddPageViewInput = {
  id: string,
  referrerDomain: string,
};

export default async (_: any, { input }: { input: AddPageViewInput }) => {
  return addCommunityPageView(input.id, input.referrerDomain).then(() => ({
    success: true,
  }));
};
