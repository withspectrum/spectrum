// @flow
import createChannel from './createChannel';
import deleteChannel from './deleteChannel';
import editChannel from './editChannel';
import toggleChannelSubscription from './toggleChannelSubscription';
import toggleChannelNotifications from './toggleChannelNotifications';
import togglePendingUser from './togglePendingUser';
import unblockUser from './unblockUser';
import archiveChannel from './archiveChannel';
import restoreChannel from './restoreChannel';
import joinChannelWithToken from './joinChannelWithToken';
import enableChannelTokenJoin from './enableChannelTokenJoin';
import disableChannelTokenJoin from './disableChannelTokenJoin';
import resetChannelJoinToken from './resetChannelJoinToken';
import updateChannelSlackBotLinks from './updateChannelSlackBotLinks';

module.exports = {
  Mutation: {
    createChannel,
    deleteChannel,
    editChannel,
    toggleChannelSubscription,
    toggleChannelNotifications,
    togglePendingUser,
    unblockUser,
    archiveChannel,
    restoreChannel,
    joinChannelWithToken,
    enableChannelTokenJoin,
    disableChannelTokenJoin,
    resetChannelJoinToken,
    updateChannelSlackBotLinks,
  },
};
