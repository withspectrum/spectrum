// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { track } from '../../../../helpers/events';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { ContinueButton } from '../../style';
import toggleCommunityMembershipMutation from 'shared/graphql/mutations/community/toggleCommunityMembership';
import {
  Row,
  CoverPhoto,
  Container,
  CoverAvatar,
  CoverTitle,
  CoverDescription,
} from '../discoverCommunities/style';
import { CoverLink, CoverSubtitle } from '../../../../components/profile/style';

type State = {
  isLoading: boolean,
};

type Props = {
  toggleCommunityMembership: Function,
  dispatch: Function,
  joinedFirstCommunity: Function,
  community: {
    id: string,
    slug: string,
    coverPhoto: string,
    profilePhoto: string,
    name: string,
    description: string,
  },
};

class JoinFirstCommunityPure extends React.Component<Props, State> {
  state = { isLoading: false };

  toggleMembership = communityId => {
    this.setState({
      isLoading: true,
    });

    this.props
      .toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        this.setState({
          isLoading: false,
        });

        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        track('community', isMember ? 'joined' : 'unjoined', null);
        track(
          'onboarding',
          isMember ? 'community joined' : 'community unjoined',
          null
        );

        const str = isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = isMember ? 'success' : 'neutral';

        this.props.dispatch(addToastWithTimeout(type, str));
        this.props.joinedFirstCommunity();

        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { community } = this.props;
    const { isLoading } = this.state;

    return (
      <Row>
        <Container key={community.id} style={{ alignSelf: 'flex-start' }}>
          <CoverPhoto url={community.coverPhoto}>
            <CoverLink to={`/${community.slug}`}>
              <CoverAvatar
                community={community}
                src={`${community.profilePhoto}?w=40&dpr=2`}
              />
              <CoverTitle>{community.name}</CoverTitle>
            </CoverLink>
          </CoverPhoto>

          {community.metaData &&
            community.metaData.members && (
              <CoverSubtitle>
                {community.metaData.members} members
              </CoverSubtitle>
            )}

          <CoverDescription style={{ paddingBottom: '16px' }}>
            {community.description}
          </CoverDescription>
        </Container>

        <Row>
          <ContinueButton
            loading={isLoading}
            onClick={() => this.toggleMembership(community.id)}
          >
            Join {community.name} and Continue
          </ContinueButton>
        </Row>
      </Row>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

const JoinFirstCommunity = compose(
  toggleCommunityMembershipMutation,
  // $FlowIssue
  connect(map)
)(JoinFirstCommunityPure);
export default JoinFirstCommunity;
