// @flow
import createChannel from './createChannel';
import deleteChannel from './deleteChannel';
import editChannel from './editChannel';
import toggleChannelSubscription from './toggleChannelSubscription';
import toggleChannelNotifications from './toggleChannelNotifications';
import togglePendingUser from './togglePendingUser';
import unblockUser from './unblockUser';
import joinChannelWithToken from './joinChannelWithToken';
import enableChannelTokenJoin from './enableChannelTokenJoin';
import disableChannelTokenJoin from './disableChannelTokenJoin';
import resetChannelJoinToken from './resetChannelJoinToken';

module.exports = {
  Mutation: {
    createChannel,
    deleteChannel,
    editChannel,
    toggleChannelSubscription,
    toggleChannelNotifications,
    togglePendingUser,
    unblockUser,
    joinChannelWithToken,
    enableChannelTokenJoin,
    disableChannelTokenJoin,
    resetChannelJoinToken,
  },
};
