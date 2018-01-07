import * as React from 'react';
import { getTopCommunities } from '../../explore/queries';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import Link from 'src/components/link';
import Icon from '../../../components/icons';
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

class UpsellExploreCommunities extends React.Component {
  state: {
    communitiesToJoin: Array<mixed>,
  };

  constructor() {
    super();

    this.state = {
      communitiesToJoin: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.communitiesToJoin.length !== this.state.communitiesToJoin.length
    )
      return true;
    if (!this.props.data.topCommunities && nextProps.data.topCommunities)
      return true;
    if (this.props.activeCommunity !== nextProps.activeCommunity) return true;
    return false;
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.data.topCommunities &&
        this.props.data.topCommunities &&
        this.props.data.topCommunities.length > 0) ||
      (this.props.data.topCommunities &&
        this.state.communitiesToJoin.length === 0)
    ) {
      const joinedCommunityIds = this.props.communities.map(c => c.id);

      // don't upsell communities the user has already joined
      const filteredTopCommunities = this.props.data.topCommunities.filter(
        c => joinedCommunityIds.indexOf(c.id) < 0
      );
      // get five random ones
      const randomTopCommunities = getRandom(filteredTopCommunities, 5);

      return this.setState({
        communitiesToJoin: randomTopCommunities,
      });
    }

    if (prevProps.communities.length !== this.props.communities.length) {
      const joinedCommunityIds = this.props.communities.map(c => c.id);
      const filteredStateCommunities = this.state.communitiesToJoin.filter(
        c => joinedCommunityIds.indexOf(c.id) < 0
      );
      const filteredTopCommunities = this.props.data.topCommunities.filter(
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

export default compose(connect(), getTopCommunities, viewNetworkHandler)(
  UpsellExploreCommunities
);
