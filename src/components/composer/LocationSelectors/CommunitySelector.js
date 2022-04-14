// @flow
// $FlowIssue
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import {
  getCommunityById,
  type GetCommunityType,
} from 'shared/graphql/queries/community/getCommunity';
import AvailableCommunitiesDropdown from './AvailableCommunitiesDropdown';
import { LoadingSelect } from 'src/components/loading';

type Props = {
  id: string,
  onCommunityChange: Function,
  data: {
    loading: boolean,
    error: ?string,
    community: ?GetCommunityType,
  },
};

const CommunitySelector = (props: Props) => {
  const { data, onCommunityChange, id } = props;
  const { loading, error, community } = data;

  const onChange = (evt: any) => onCommunityChange(evt.target.value);

  if (loading) return <LoadingSelect />;

  /*
    If for some reason the query to get an individual community fails,
    just return the AvailableCommunitiesDropdown which will do a followup
    fetch of all the current user's communities
  */
  useEffect(
    () => {
      // remove any parent selected community id
      if (error) onCommunityChange('');
    },
    [error]
  );

  if (error) {
    return <AvailableCommunitiesDropdown onChange={onChange} />;
  }

  /*
    if no community was found, the id in the query param was bad or the user
    doesn't have permission to post there. If so, just fetch the communities
    the user can post to
  */
  if (!community) return <AvailableCommunitiesDropdown onChange={onChange} />;

  /*
    If the user doesn't have permission to view the community, we will
    force them to choose a community that they do have access to. In this scenario,
    we don't care if the selection *should* be locked - it's clear that the
    user has a query param for a community where they don't have permission to post
  */
  const { communityPermissions } = community;
  const { isMember, isBlocked } = communityPermissions;
  if (!isMember || isBlocked) {
    return <AvailableCommunitiesDropdown onChange={onChange} />;
  }

  /*
    We can safely pass along a selected id when we know it's a valid community
    and the user has permission to post there
  */
  return <AvailableCommunitiesDropdown id={id} onChange={onChange} />;
};

export default compose(getCommunityById)(CommunitySelector);
