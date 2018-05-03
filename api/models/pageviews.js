// @flow
import { padStart } from 'lodash';
const { db } = require('./db');
import type {
  PageViewType,
  PageViewData,
  PageViewResult,
  PageViewRefererData,
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
  type PlainResult = {
    group: [number, number, number],
    reduction: number,
  };
  type RefererResult = {
    group: [string],
    reduction: number,
  };
  const plainPageViewCountQuery = db
    .table('pageviews')
    .getAll([id, pageviewType.toLowerCase()], { index: 'refId_refType' })
    .group([
      db.row('createdAt').year(),
      db.row('createdAt').month(),
      db.row('createdAt').day(),
    ])
    .count()
    .run();
  const refererPageViewCountQuery = db
    .table('pageviews')
    .getAll([id, pageviewType.toLowerCase()], { index: 'refId_refType' })
    .group([db.row('refererDomain')])
    .count()
    .run();
  const [results, refererResults]: [
    PlainResult[],
    RefererResult[],
  ] = await Promise.all([plainPageViewCountQuery, refererPageViewCountQuery]);
  const pageViewData = results.map(toPageViewData);
  const refererData = refererResults.map(toRefererData);
  return {
    resolution: 'day',
    data: pageViewData,
    refererData,
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

function toRefererData({ group, reduction }): PageViewRefererData {
  return {
    refererDomain: group[0],
    views: reduction,
  };
}
