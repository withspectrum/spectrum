// @flow
import * as React from 'react';
import { getCommunitiesByCuratedContentType } from 'shared/graphql/queries/community/getCommunities';
import type { GetCommunitiesType } from 'shared/graphql/queries/community/getCommunities';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import { connect } from 'react-redux';
import Link from '../../../components/link';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { CommunityListAvatar, UpsellRow } from '../style';
import { track } from 'src/helpers/events';
import * as events from 'shared/analytics/event-types';

const getRandom = (arr, n) => {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) return arr;
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len;
  }
  return result;
};

type Props = {
  data: {
    communities: GetCommunitiesType,
  },
  communities: Array<GetCommunityType>,
  activeCommunity: ?string,
};

type State = {
  communitiesToJoin: GetCommunitiesType,
};

class UpsellExploreCommunities extends React.Component<Props, State> {
  state = {
    communitiesToJoin: [],
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.communitiesToJoin.length !== this.state.communitiesToJoin.length
    )
      return true;
    if (!this.props.data.communities && nextProps.data.communities) return true;
    if (this.props.activeCommunity !== nextProps.activeCommunity) return true;
    return false;
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.data.communities &&
        this.props.data.communities &&
        this.props.data.communities.length > 0) ||
      (this.props.data.communities && this.state.communitiesToJoin.length === 0)
    ) {
      const joinedCommunityIds = this.props.communities.map(c => c && c.id);

      // don't upsell communities the user has already joined
      const filteredTopCommunities = this.props.data.communities.filter(
        c => c && joinedCommunityIds.indexOf(c.id) < 0
      );

      const uniqueFiltered = filteredTopCommunities.filter(
        (x, i, a) => a.indexOf(x) === i
      );

      // get five random ones
      const randomTopCommunities = getRandom(uniqueFiltered, 5);

      return this.setState({
        communitiesToJoin: randomTopCommunities,
      });
    }

    if (
      prevProps.data &&
      prevProps.data.communities &&
      prevProps.data.communities.length !== this.props.data.communities.length
    ) {
      const joinedCommunityIds = this.props.data.communities.map(
        c => c && c.id
      );
      const filteredStateCommunities = this.state.communitiesToJoin.filter(
        c => c && joinedCommunityIds.indexOf(c.id) < 0
      );
      const filteredTopCommunities = this.props.data.communities.filter(
        c => c && joinedCommunityIds.indexOf(c.id) < 0
      );
      const uniqueFiltered = filteredTopCommunities.filter(
        (x, i, a) => a.indexOf(x) === i
      );
      const newRandom = getRandom(uniqueFiltered, 1);
      const newArr = [...filteredStateCommunities, newRandom[0]];
      return this.setState({
        communitiesToJoin: newArr,
      });
    }
  }

  render() {
    const { activeCommunity } = this.props;
    const { communitiesToJoin } = this.state;

    if (communitiesToJoin && communitiesToJoin.length > 0) {
      return (
        <UpsellRow>
          {communitiesToJoin.map(c => {
            if (!c) return null;
            return (
              <Link
                to={`/${c.slug}`}
                key={c.id}
                onClick={() => track(events.INBOX_UPSELL_COMMUNITY_CLICKED)}
              >
                <CommunityListAvatar
                  active={c.id === activeCommunity}
                  src={c.profilePhoto}
                />
              </Link>
            );
          })}
        </UpsellRow>
      );
    }

    return null;
  }
}

export default compose(
  connect(),
  getCommunitiesByCuratedContentType,
  viewNetworkHandler
)(UpsellExploreCommunities);
