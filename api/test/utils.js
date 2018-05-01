// @flow
import { graphql } from 'graphql';
import createLoaders from '../loaders';
import schema from '../schema';
import permissions from '../routes/api/graphql';

type Options = {
  context?: {
    user?: ?Object,
  },
  variables?: ?Object,
};

// Nice little helper function for tests
export const request = (query: mixed, { context, variables }: Options = {}) => {
  console.log('CONTEXT', context);

  const loaders = createLoaders();

  let currentUser =
    context && context.user && !context.user.bannedAt ? context.user : null;

  if (context && context.user && context.user.id && !context.user.bannedAt) {
    const thisPermissions = permissions(context.user.id, loaders);

    console.log('PERMISSIONS', thisPermissions);

    const {
      communityPermissions,
      channelPermissions,
      canAdministerChannel,
      canModerateChannel,
      canAdministerCommunity,
      canModerateCommunity,
    } = thisPermissions;

    currentUser = Object.assign({}, currentUser, {
      communityPermissions,
      channelPermissions,
      canAdministerChannel,
      canModerateChannel,
      canAdministerCommunity,
      canModerateCommunity,
    });
  }

  const newContext = Object.assign({}, context, {
    user: {
      ...currentUser,
    },
  });

  return graphql(
    schema,
    query,
    undefined,
    { loaders: createLoaders(), ...newContext },
    variables
  );
};
