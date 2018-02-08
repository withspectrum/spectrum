// @flow
const debug = require('debug')('chronos:queue:process-core-metrics');
import { intersection, difference } from 'lodash';
import { getLastTwoCoreMetrics } from '../../models/coreMetrics';
import { addQueue } from '../../jobs/utils';
import { SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL } from '../constants';

export default async () => {
  debug('\nprocessing active community admin report');
  const lastTwoCoreMetrics = await getLastTwoCoreMetrics();
  const thisCoreMetrics = lastTwoCoreMetrics[0];
  const prevCoreMetrics = lastTwoCoreMetrics[1];
  // don't do this for the first job
  if (!prevCoreMetrics || !prevCoreMetrics.dacSlugs) return;

  // we want to figure out what daily, weekly, and monthly active communities
  // were added or were lost during the last 24 hours. To do this, we will compare
  // two arrays for each time range
  const {
    dacSlugs: thisDacSlugs,
    wacSlugs: thisWacSlugs,
    macSlugs: thisMacSlugs,
  } = thisCoreMetrics;

  const {
    dacSlugs: prevDacSlugs,
    wacSlugs: prevWacSlugs,
    macSlugs: prevMacSlugs,
  } = prevCoreMetrics;

  // values that both arrays contain
  const overlappingDac = intersection(thisDacSlugs, prevDacSlugs);
  const overlappingWac = intersection(thisWacSlugs, prevWacSlugs);
  const overlappingMac = intersection(thisMacSlugs, prevMacSlugs);

  // values that exist in the 1st record but not in the 2nd
  const newDac = difference(thisDacSlugs, prevDacSlugs);
  const newWac = difference(thisWacSlugs, prevWacSlugs);
  const newMac = difference(thisMacSlugs, prevMacSlugs);

  // values that exist in the 2nd record but not in the 1st record
  const lostDac = difference(prevDacSlugs, thisDacSlugs);
  const lostWac = difference(prevWacSlugs, thisWacSlugs);
  const lostMac = difference(prevMacSlugs, thisMacSlugs);

  try {
    addQueue(
      SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,
      {
        allDac: thisDacSlugs,
        allWac: thisWacSlugs,
        allMac: thisMacSlugs,
        overlappingDac,
        overlappingWac,
        overlappingMac,
        newDac,
        newWac,
        newMac,
        lostDac,
        lostWac,
        lostMac,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
};
