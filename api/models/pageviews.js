// @flow
import { padStart } from 'lodash';
const { db } = require('./db');
import type {
  PageViewType,
  PageViewData,
  PageViewResult,
} from '../../shared/types';

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

/**
 * Gets the pageviews in an aggregated form
 */
type GetAggregatedViewsParams = {
  id: string,
  pageviewType: PageViewType,
  startDate?: string,
  endDate?: string,
};
export const getAggregatedViews = async ({
  id,
  pageviewType,
  startDate,
  endDate,
}: GetAggregatedViewsParams): Promise<PageViewResult> => {
  type Result = {
    group: [number, number, number],
    reduction: number,
  };
  const results: Result[] = await db
    .table('pageviews')
    .getAll([id, pageviewType.toLowerCase()], { index: 'refId_refType' })
    .group([
      db.row('createdAt').year(),
      db.row('createdAt').month(),
      db.row('createdAt').day(),
    ])
    .count()
    .run();
  const pageViewData = results.map(toPageViewData);
  return {
    resolution: 'day',
    data: pageViewData,
  };
};

/**
 * Converts data returned by the data to PageViewData format
 */
function toPageViewData({ group, reduction }): PageViewData {
  const [year, month, day] = group;
  const paddedMonth = padStart(`${month}`, 2, '0');
  const paddedDay = padStart(`${day}`, 2, '0');
  return {
    date: `${year}/${paddedMonth}/${paddedDay}`,
    views: reduction,
  };
}
