// @flow
const { db } = require('./db');
import type { PageViewType } from '../../shared/types';

type AddPageViewParam = {
  id: string,
  refererDomain?: string,
  pageviewType: PageViewType,
};

export const addPageView = ({
  id,
  refererDomain,
  pageviewType,
}: AddPageViewParam) => {
  return db
    .table('pageviews')
    .insert({
      createdAt: new Date(),
      refType: pageviewType.toLowerCase(),
      refId: id,
      refererDomain,
    })
    .run();
};

type GetPageViewParam = {
  id: string,
  pageviewType: PageViewType,
};
export const getPageViews = ({ id, pageviewType }: GetPageViewParam) => {
  return db
    .table('pageviews')
    .filter({ refId: id, refType: pageviewType.toLowerCase() })
    .run();
};
