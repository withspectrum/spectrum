// @flow
import createCommunity from './createCommunity';
import deleteCommunity from './deleteCommunity';
import editCommunity from './editCommunity';
import toggleCommunityMembership from './toggleCommunityMembership';
import sendSlackInvites from './sendSlackInvites';
import sendEmailInvites from './sendEmailInvites';
import pinThread from './pinThread';
import updateAdministratorEmail from './updateAdministratorEmail';
import enableBrandedLogin from './enableBrandedLogin';
import disableBrandedLogin from './disableBrandedLogin';
import saveBrandedLoginSettings from './saveBrandedLoginSettings';
import importSlackMembers from './importSlackMembers';
import enableCommunityTokenJoin from './enableCommunityTokenJoin';
import disableCommunityTokenJoin from './disableCommunityTokenJoin';
import resetCommunityJoinToken from './resetCommunityJoinToken';
import enableCommunityWatercooler from './enableCommunityWatercooler';
import disableCommunityWatercooler from './disableCommunityWatercooler';
import setCommunityLastSeen from './setCommunityLastSeen';
import toggleCommunityRedirect from './toggleCommunityRedirect';
import toggleCommunityNoindex from './toggleCommunityNoindex.js';

module.exports = {
  Mutation: {
    createCommunity,
    deleteCommunity,
    editCommunity,
    toggleCommunityMembership,
    sendSlackInvites,
    sendEmailInvites,
    pinThread,
    updateAdministratorEmail,
    enableBrandedLogin,
    disableBrandedLogin,
    saveBrandedLoginSettings,
    importSlackMembers,
    enableCommunityTokenJoin,
    disableCommunityTokenJoin,
    resetCommunityJoinToken,
    enableCommunityWatercooler,
    disableCommunityWatercooler,
    setCommunityLastSeen,
    toggleCommunityRedirect,
    toggleCommunityNoindex,
  },
};
