// @flow
import * as React from 'react';
import { getCommunitiesByCuratedContentType } from 'shared/graphql/queries/community/getCommunities';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { CommunityListAvatar } from '../style';
import { FlexRow } from '../../../components/globals';

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

type CommunityType = {
  id: string,
  profilePhoto: string,
};

type Props = {
  data: {
    communities: Array<CommunityType>,
  },
  activeCommunity: ?string,
};

type State = {
  communitiesToJoin: Array<CommunityType>,
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
      const joinedCommunityIds = this.props.data.communities.map(c => c.id);

      // don't upsell communities the user has already joined
      const filteredTopCommunities = this.props.data.communities.filter(
        c => joinedCommunityIds.indexOf(c.id) < 0
      );
      // get five random ones
      const randomTopCommunities = getRandom(filteredTopCommunities, 5);

      return this.setState({
        communitiesToJoin: randomTopCommunities,
      });
    }

    if (
      prevProps.data.communities.length !== this.props.data.communities.length
    ) {
      const joinedCommunityIds = this.props.data.communities.map(c => c.id);
      const filteredStateCommunities = this.state.communitiesToJoin.filter(
        c => joinedCommunityIds.indexOf(c.id) < 0
      );
      const filteredTopCommunities = this.props.data.communities.filter(
        c => joinedCommunityIds.indexOf(c.id) < 0
      );
      const newRandom = getRandom(filteredTopCommunities, 1);
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
        <FlexRow>
          {communitiesToJoin.map(c => {
            return (
              <CommunityListAvatar
                active={c.id === activeCommunity}
                src={c.profilePhoto}
              />
            );
          })}
        </FlexRow>
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
