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
  },
};
