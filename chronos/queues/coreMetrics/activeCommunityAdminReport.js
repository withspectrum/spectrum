// @flow
import { difference } from 'lodash';
import { getLastTwoCoreMetrics } from 'chronos/models/coreMetrics';
import { _adminSendActiveCommunityReportEmailQueue } from 'shared/bull/queues';

export default async () => {
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
