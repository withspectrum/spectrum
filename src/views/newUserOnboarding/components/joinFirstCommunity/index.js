import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../../../helpers/events';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { ContinueButton } from '../../style';
import { toggleCommunityMembershipMutation } from '../../../../api/community';
import {
  Row,
  CoverPhoto,
  Container,
  CoverAvatar,
  CoverTitle,
  CoverDescription,
} from '../discoverCommunities/style';
import { CoverLink, CoverSubtitle } from '../../../../components/profile/style';

class JoinFirstCommunityPure extends Component {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }
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
              <CoverAvatar src={`${community.profilePhoto}?w=40&dpr=2`} />
              <CoverTitle>{community.name}</CoverTitle>
            </CoverLink>
          </CoverPhoto>
          <CoverSubtitle>{community.metaData.members} members</CoverSubtitle>

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
  connect(map)
)(JoinFirstCommunityPure);
export default JoinFirstCommunity;
