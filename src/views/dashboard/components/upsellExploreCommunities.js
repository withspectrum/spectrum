import * as React from 'react';
import { getTopCommunities } from '../../explore/queries';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Link } from 'react-router-dom';
import Icon from '../../../components/icons';
import {
  ExploreCommunityListItem,
  AllCommunityListItem,
  CommunityListName,
  CommunityListItem,
  CommunityListPadding,
  CommunityListAvatar,
  CommunityListReputation,
  CommunityListText,
  UpsellExploreDivider,
} from '../style';

const getRandom = (arr, n) => {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
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

  componentDidUpdate(prevProps) {
    const joinedCommunityIds = this.props.communities.map(c => c.id);

    if (
      (!prevProps.data.topCommunities &&
        this.props.data.topCommunities &&
        this.props.data.topCommunities.length > 0) ||
      (this.props.data.topCommunities &&
        this.state.communitiesToJoin.length === 0)
    ) {
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
    const {
      communities, // already joined by the user
      activeCommunity,
    } = this.props;
    const { communitiesToJoin } = this.state;

    if (communitiesToJoin) {
      return (
        <div>
          <UpsellExploreDivider />

          <ExploreCommunityListItem upsell>
            <Link to={'/explore'}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AllCommunityListItem>
                  <Icon glyph={'explore'} />
                </AllCommunityListItem>
                <CommunityListName>Explore communities</CommunityListName>
              </div>
            </Link>
          </ExploreCommunityListItem>

          {communitiesToJoin.map(c => {
            return (
              <CommunityListItem key={c.id} active={c.id === activeCommunity}>
                <CommunityListPadding
                  onClick={() => this.props.handleOnClick(c.id)}
                  active={c.id === activeCommunity}
                >
                  <CommunityListAvatar
                    active={c.id === activeCommunity}
                    src={c.profilePhoto}
                  />
                  <CommunityListText>
                    <CommunityListName active={c.id === activeCommunity}>
                      {c.name}
                    </CommunityListName>
                    <CommunityListReputation active={c.id === activeCommunity}>
                      {c.metaData.members.toLocaleString()} members
                    </CommunityListReputation>
                  </CommunityListText>
                </CommunityListPadding>
              </CommunityListItem>
            );
          })}
        </div>
      );
    }

    return null;
  }
}

export default compose(connect(), getTopCommunities, viewNetworkHandler)(
  UpsellExploreCommunities
);
