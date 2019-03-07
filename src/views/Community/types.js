// @flow
import type { History, Location, Match } from 'react-router';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import type { ViewNetworkHandlerType } from 'src/components/viewNetworkHandler';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { Dispatch } from 'redux';
import type { GetCommunityMembersType } from 'shared/graphql/queries/community/getCommunityMembers';

export type Community = ?GetCommunityType;
export type CurrentUser = ?UserInfoType;

export type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  dispatch: Dispatch<Object>,
  history: History,
  location: Location,
  match: {
    ...$Exact<Match>,
    params: {
      communitySlug: string,
    },
  },
  currentUser: CurrentUser,
  data: {
    refetch: Function,
    startPolling: Function,
    stopPolling: Function,
    community: Community,
  },
};

export type SignedInMemberType = {
  community: Community,
  currentUser: CurrentUser,
  dispatch: Dispatch<Object>,
};

export type CommunityProfileHeaderType = {
  community: Community,
};

export type TeamMemberListType = {
  id: string,
  first: number,
  filter: Object,
  dispatch: Dispatch<Object>,
  ...$Exact<ViewNetworkHandlerType>,
  currentUser: CurrentUser,
  data: {
    community: ?GetCommunityMembersType,
  },
  history: History,
  location: Location,
  community: Community,
};

export type CommunityActionRowType = {
  community: Community,
  dispatch: Dispatch<Object>,
};

export type CommunityMetaType = {
  community: Community,
};

export type CommunityFeedsType = {
  community: Community,
  currentUser: CurrentUser,
  dispatch: Dispatch<Object>,
};
