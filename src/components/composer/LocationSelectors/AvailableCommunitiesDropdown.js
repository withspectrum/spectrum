// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import type { Location } from 'react-router';
import querystring from 'query-string';
import {
  getCurrentUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from 'shared/graphql/queries/user/getUserCommunityConnection';
import { LoadingSelect, ErrorSelect } from 'src/components/loading';
import { sortCommunities } from '../utils';
import { RequiredSelector } from '../style';

type Props = {
  onChange: Function,
  id: string,
  location: Location,
  data: {
    loading: boolean,
    error: ?string,
    user: GetUserCommunityConnectionType,
  },
};

const AvailableCommunitiesDropdown = (props: Props) => {
  const { data, onChange, id, location } = props;
  const { loading, error, user } = data;

  if (loading) return <LoadingSelect />;
  if (error)
    return <ErrorSelect>Something went wrong, please refresh</ErrorSelect>;
  if (!user) return <ErrorSelect>Please sign in to Spectrum</ErrorSelect>;

  const { edges } = user.communityConnection;
  if (!edges || edges.length === 0)
    return <ErrorSelect>You’re not a member of any communities</ErrorSelect>;

  const nodes = edges.map(edge => edge && edge.node);

  const { search } = location;
  const { composerCommunityId } = querystring.parse(search);
  const communityIsValid = nodes.some(community => {
    return (
      community && community.id === id && community.id === composerCommunityId
    );
  });
  const shouldDisableCommunitySelect =
    communityIsValid && composerCommunityId === id;
  const sortedNodes = sortCommunities(nodes);

  return (
    <RequiredSelector
      data-cy="composer-community-selector"
      onChange={onChange}
      disabled={shouldDisableCommunitySelect}
      value={id}
    >
      {/* $FlowIssue */}
      <React.Fragment>
        <option value={''}>Choose a community</option>

        {sortedNodes.map(community => {
          if (!community) return null;
          return (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          );
        })}
      </React.Fragment>
    </RequiredSelector>
  );
};

export default compose(
  withRouter,
  getCurrentUserCommunityConnection
)(AvailableCommunitiesDropdown);
