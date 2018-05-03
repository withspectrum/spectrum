// @flow
import { padStart } from 'lodash';
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { getAggregatedViews } from '../../models/pageviews';

function toPageViewData({ group, reduction }) {
  const [year, month, day] = group;
  const paddedMonth = padStart(`${month}`, 2, '0');
  const paddedDay = padStart(`${day}`, 2, '0');
  return {
    date: `${year}/${paddedMonth}/${paddedDay}`,
    views: reduction,
  };
}

export default async ({ id }: DBCommunity, _: any) => {
  const results = await getAggregatedViews({ id, pageviewType: 'community' });
  const pageViewData = results.map(toPageViewData);
  return pageViewData;
};
