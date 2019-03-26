// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

export type GetChannelType = {
  ...$Exact<ChannelInfoType>,
};

export const getChannelByIdQuery = gql`
  query getChannelById($id: ID) {
    channel(id: $id) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const getChannelByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getChannelById = graphql(
  getChannelByIdQuery,
  getChannelByIdOptions
);

/*
  Alternative implementation that takes a channel slug and community slug
  to perform a lookup
  Used to check for duplicate channel names during channel creation, and can
  be used as a way to get a channel based on url params.
*/
export const getChannelBySlugAndCommunitySlugQuery = gql`
  query getChannelBySlugAndCommunitySlug(
    $channelSlug: LowercaseString
    $communitySlug: LowercaseString
  ) {
    channel(channelSlug: $channelSlug, communitySlug: $communitySlug) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const getChannelBySlugAndCommunitySlugOptions = {
  options: ({ channelSlug, communitySlug }) => ({
    variables: {
      channelSlug: channelSlug,
      communitySlug: communitySlug,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getChannelBySlugAndCommunitySlug = graphql(
  getChannelBySlugAndCommunitySlugQuery,
  getChannelBySlugAndCommunitySlugOptions
);

const getChannelByMatchOptions = {
  options: ({
    match: {
      params: { channelSlug, communitySlug },
    },
  }) => ({
    variables: {
      channelSlug: channelSlug,
      communitySlug: communitySlug,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getChannelByMatch = graphql(
  getChannelBySlugAndCommunitySlugQuery,
  getChannelByMatchOptions
);
