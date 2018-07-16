// @flow
import * as React from 'react';
import {
  getCurrentUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from 'shared/graphql/queries/user/getUserCommunityConnection';
import Link from 'src/components/link';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import compose from 'recompose/compose';
import { CommunityAvatar } from 'src/components/avatar';
import { Button } from 'src/components/buttons';
import {
  CommunityListGrid,
  CommunityListRow,
  CommunityCard,
  CommunityCardName,
  CommunityListActions,
  CommunityListCard,
  CardTitle,
} from '../style';
import { track, events, transformations } from 'src/helpers/analytics';

type Props = {
  data: {
    user: GetUserCommunityConnectionType,
  },
  upgrade?: boolean,
};

type State = {
  hasError: boolean,
};

class CommunityList extends React.Component<Props, State> {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  shouldComponentUpdate() {
    const curr = this.props;
    // no more updates once the initial fetch is done
    if (curr.data && curr.data.user && curr.data.user.communityConnection)
      return false;
    return true;
  }

  upgrade = community => {
    track(events.PRICING_PAGE_UPGRADE_COMMUNITY_CLICKED, {
      community: transformations.analyticsCommunity(community),
    });
  };

  applyForDiscount = community => {
    track(events.PRICING_PAGE_APPLY_FOR_DISCOUNT_CLICKED, {
      community: transformations.analyticsCommunity(community),
    });
  };

  calculateOwnedCommunities = (props: Props) => {
    const { data: { user } } = props;

    if (!user)
      return {
        ownedCommunities: [],
        ownsCommunities: null,
      };

    const isUser = user && user.communityConnection;

    const hasCommunities =
      isUser &&
      user.communityConnection.edges &&
      user.communityConnection.edges.length > 0;

    const ownsCommunities =
      hasCommunities &&
      user.communityConnection.edges.some(
        c => c && c.node.communityPermissions.isOwner
      );

    const ownedCommunities = ownsCommunities
      ? user.communityConnection.edges
          .filter(c => c && c.node.communityPermissions.isOwner)
          .filter(Boolean)
          .map(c => c.node)
      : [];

    return {
      ownedCommunities,
      ownsCommunities,
    };
  };

  render() {
    const {
      ownedCommunities,
      ownsCommunities,
    } = this.calculateOwnedCommunities(this.props);

    const { hasError } = this.state;

    if (hasError) return null;

    if (ownsCommunities && this.props.upgrade) {
      return (
        <CommunityListCard data-cy="owned-communities-list">
          <CardTitle>Your communities</CardTitle>
          <CommunityListGrid>
            {ownedCommunities.map(community => {
              if (!community) return null;
              return (
                <CommunityCard key={community.id}>
                  <CommunityAvatar
                    showHoverProfile={false}
                    community={community}
                  />
                  <CommunityCardName>{community.name}</CommunityCardName>
                  <CommunityListActions>
                    <Link
                      onClick={() => this.upgrade(community)}
                      to={`/${community.slug}/settings`}
                    >
                      <Button
                        style={{
                          flex: '1 0 auto',
                          width: 'calc(100%)',
                          fontSize: '16px',
                        }}
                      >
                        Upgrade
                      </Button>
                    </Link>
                  </CommunityListActions>
                </CommunityCard>
              );
            })}
          </CommunityListGrid>
        </CommunityListCard>
      );
    }

    if (ownsCommunities) {
      return (
        <CommunityListRow>
          {ownedCommunities.map(community => {
            if (!community) return null;
            return (
              <CommunityCard key={community.id}>
                <CommunityAvatar
                  showHoverProfile={false}
                  community={community}
                />
                <CommunityCardName>{community.name}</CommunityCardName>
                <CommunityListActions>
                  <a
                    href={`mailto:hi@spectrum.chat?subject=Discount request for the ${
                      community.name
                    } community`}
                    onClick={() => this.applyForDiscount(community)}
                  >
                    <Button
                      style={{
                        flex: '1 0 auto',
                        width: 'calc(100%)',
                        fontSize: '16px',
                      }}
                    >
                      Apply for discount
                    </Button>
                  </a>
                </CommunityListActions>
              </CommunityCard>
            );
          })}
        </CommunityListRow>
      );
    }

    return null;
  }
}

export default compose(getCurrentUserCommunityConnection, viewNetworkHandler)(
  CommunityList
);
