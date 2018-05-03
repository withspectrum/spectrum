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

/**
 * Gets the pageviews in an aggregated form
 */
type GetAggregatedViewsParams = {
  id: string,
  pageviewType: PageViewType,
  startDate?: string,
  endDate?: string,
};
type GetAggregatedViewsReturn = {
  group: [number, number, number],
  reduction: number,
};
export const getAggregatedViews = ({
  id,
  pageviewType,
  startDate,
  endDate,
}: GetAggregatedViewsParams): Promise<GetAggregatedViewsReturn[]> => {
  return db
    .table('pageviews')
    .getAll([id, pageviewType.toLowerCase()], { index: 'refId_refType' })
    .group([
      db.row('createdAt').year(),
      db.row('createdAt').month(),
      db.row('createdAt').day(),
    ])
    .count()
    .run();
};
