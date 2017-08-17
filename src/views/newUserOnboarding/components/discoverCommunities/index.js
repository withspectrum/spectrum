// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import pure from 'recompose/pure';
import { track } from '../../../../helpers/events';
import { getTopCommunities } from '../../../../api/community';
import { toggleCommunityMembershipMutation } from '../../../../api/community';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { displayLoadingState } from '../../../../components/loading';
import { Button, OutlineButton } from '../../../../components/buttons';
import { ContinueButton } from '../../style';
import {
  Row,
  StickyRow,
  CoverPhoto,
  Container,
  CoverAvatar,
  CoverTitle,
  CoverDescription,
  ButtonContainer,
} from './style';
import { CoverLink, CoverSubtitle } from '../../../../components/profile/style';

class TopCommunitiesPure extends Component {
  state: {
    loading: string,
    hasJoined: number,
  };

  constructor() {
    super();

    this.state = { loading: '', hasJoined: 0 };
  }

  toggleMembership = communityId => {
    this.setState({
      loading: communityId,
    });

    this.props
      .toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        this.setState({
          loading: '',
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

        this.props.joinedCommunity(isMember ? 1 : -1);
      })
      .catch(err => {
        this.setState({
          loading: '',
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { data: { topCommunities, error }, hasJoined } = this.props;
    const { loading } = this.state;
    // don't display communities where the user is blocked
    const filteredCommunities = topCommunities.filter(
      community => !community.communityPermissions.isBlocked
    );

    if (!error && filteredCommunities.length > 0) {
      return (
        <Row hasJoined={hasJoined > 0}>
          {filteredCommunities.map(community => {
            return (
              <Container key={community.id}>
                <CoverPhoto url={community.coverPhoto}>
                  <CoverLink to={`/${community.slug}`}>
                    <CoverAvatar src={`${community.profilePhoto}?w=40&dpr=2`} />
                    <CoverTitle>
                      {community.name}
                    </CoverTitle>
                  </CoverLink>
                </CoverPhoto>
                <CoverSubtitle>
                  {community.metaData.members} members
                </CoverSubtitle>

                <CoverDescription>
                  {community.description}
                </CoverDescription>

                <ButtonContainer>
                  {community.communityPermissions.isMember
                    ? <OutlineButton
                        onClick={() => this.toggleMembership(community.id)}
                        gradientTheme="none"
                        color={'pro.alt'}
                        hoverColor={'pro.default'}
                        loading={loading === community.id}
                      >
                        Joined!
                      </OutlineButton>
                    : <Button
                        onClick={() => this.toggleMembership(community.id)}
                        loading={loading === community.id}
                        gradientTheme={'success'}
                        style={{ fontSize: '16px' }}
                        icon={'plus'}
                      >
                        Join
                      </Button>}
                </ButtonContainer>
              </Container>
            );
          })}

          {hasJoined > 0 &&
            <StickyRow>
              <ContinueButton
                style={{ marginTop: '0' }}
                onClick={this.props.doneExploring}
              >
                Continue to my home feed
              </ContinueButton>
            </StickyRow>}
        </Row>
      );
    }
  }
}

const TopCommunities = compose(
  getTopCommunities,
  toggleCommunityMembershipMutation,
  displayLoadingState,
  connect(),
  pure
)(TopCommunitiesPure);
export default TopCommunities;
