// @flow
const debug = require('debug')('chronos:queues:active-community-admin-report');
import Raven from 'shared/raven';
import { difference } from 'lodash';
import { getLastTwoCoreMetrics } from 'chronos/models/coreMetrics';
import { _adminSendActiveCommunityReportEmailQueue } from 'shared/bull/queues';

const processJob = async () => {
  const [thisCoreMetrics, prevCoreMetrics] = await getLastTwoCoreMetrics();

  if (!prevCoreMetrics || !prevCoreMetrics.dacSlugs) return;

  const {
    dac: thisDacCount,
    wac: thisWacCount,
    mac: thisMacCount,
    dacSlugs: thisDacSlugs,
    wacSlugs: thisWacSlugs,
    macSlugs: thisMacSlugs,
  } = thisCoreMetrics;

  const {
    dacSlugs: prevDacSlugs,
    wacSlugs: prevWacSlugs,
    macSlugs: prevMacSlugs,
  } = prevCoreMetrics;

  _adminSendActiveCommunityReportEmailQueue.add({
    dacCount: thisDacCount,
    wacCount: thisWacCount,
    macCount: thisMacCount,
    newDac: difference(prevDacSlugs, thisDacSlugs),
    newWac: difference(prevWacSlugs, thisWacSlugs),
    newMac: difference(prevMacSlugs, thisMacSlugs),
    lostDac: difference(thisDacSlugs, prevDacSlugs),
    lostWac: difference(thisWacSlugs, prevWacSlugs),
    lostMac: difference(thisMacSlugs, prevMacSlugs),
  });
};

export default async () => {
  try {
    await processJob();
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
