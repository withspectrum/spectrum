// @flow
const debug = require('debug')('chronos:queue:process-core-metrics');
import Raven from 'shared/raven';
import { intersection, difference } from 'lodash';
import { getLastTwoCoreMetrics } from '../../models/coreMetrics';
import { addQueue } from '../../jobs/utils';
import { SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL } from '../constants';
import { _adminSendActiveCommunityReport } from 'shared/bull/queues';

export default async () => {
  debug('\nprocessing active community admin report');
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

  _adminSendActiveCommunityReport.add({
    dacCount: thisDacCount,
    wacCount: thisWacCount,
    macCount: thisMacCount,
    newDac: difference(thisDacSlugs, prevDacSlugs),
    newWac: difference(thisWacSlugs, prevWacSlugs),
    newMac: difference(thisMacSlugs, prevMacSlugs),
    lostDac: difference(prevDacSlugs, thisDacSlugs),
    lostWac: difference(prevWacSlugs, thisWacSlugs),
    lostMac: difference(prevMacSlugs, thisMacSlugs),
  });
};
