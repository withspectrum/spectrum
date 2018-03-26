// @flow
import * as React from 'react';
import {
  getCurrentUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from 'shared/graphql/queries/user/getUserCommunityConnection';
import Link from 'src/components/link';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import compose from 'recompose/compose';
import {
  CommunityListGrid,
  CommunityCard,
  CommunityCardAvatar,
  CommunityCardName,
  CommunityCardButton,
  Section,
  SectionTitle,
  SectionDescription,
} from '../style';

type Props = {
  data: {
    user: GetUserCommunityConnectionType,
  },
  setOwnsCommunities: Function,
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

  componentDidUpdate() {
    const curr = this.props;
    const { ownsCommunities } = this.calculateOwnedCommunities(curr);

    if (ownsCommunities) {
      this.props.setOwnsCommunities();
    }
  }

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

    if (ownsCommunities) {
      return (
        <Section data-e2e-id="pricing-page-owned-communities-list">
          <SectionTitle>Your communities</SectionTitle>
          <SectionDescription>
            We found these communities that you already own - you can manage
            them in their settings or apply directly for an open-source,
            non-profit, or education discount.
          </SectionDescription>

          <SectionDescription>
            When applying for a discount, please provide as much information as
            possible about your project or community so that we can help you as
            quickly as possible.
          </SectionDescription>

          <CommunityListGrid>
            {ownedCommunities.map(community => {
              if (!community) return null;
              return (
                <CommunityCard key={community.id}>
                  <CommunityCardAvatar src={community.profilePhoto} />
                  <CommunityCardName>{community.name}</CommunityCardName>
                  <Link to={`/${community.slug}/settings`}>
                    <CommunityCardButton>Manage</CommunityCardButton>
                  </Link>
                  <a
                    href={`mailto:hi@spectrum.chat?subject=Discount request for the ${
                      community.name
                    } community`}
                  >
                    <CommunityCardButton>
                      Apply for discount
                    </CommunityCardButton>
                  </a>
                </CommunityCard>
              );
            })}
          </CommunityListGrid>
        </Section>
      );
    }

    return null;
  }
}

export default compose(getCurrentUserCommunityConnection, viewNetworkHandler)(
  CommunityList
);
