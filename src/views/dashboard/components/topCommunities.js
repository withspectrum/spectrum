// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import pure from 'recompose/pure';
import { getTopCommunities } from '../queries';
import { toggleCommunityMembershipMutation } from '../../../api/community';
import { addToastWithTimeout } from '../../../actions/toasts';
import { displayLoadingState } from '../../../components/loading';
import { Button, OutlineButton } from '../../../components/buttons';
import {
  Row,
  CoverPhoto,
  Container,
  CoverAvatar,
  CoverTitle,
  ButtonContainer,
} from './topCommunitiesStyle';
import { CoverLink, CoverSubtitle } from '../../../components/profile/style';

class TopCommunitiesPure extends Component {
  toggleMembership = communityId => {
    this.props
      .toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        const action = isMember ? this.props.join() : this.props.leave();

        const str = isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = isMember ? 'success' : 'neutral';

        this.props.dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { data: { topCommunities, error } } = this.props;

    if (!error && topCommunities.length > 0) {
      return (
        <Row>
          {topCommunities.map(community => {
            return (
              <Container key={community.id}>
                <CoverPhoto url={community.coverPhoto}>
                  <CoverLink to={`/${community.slug}`}>
                    <CoverAvatar src={`${community.profilePhoto}?w=40&dpr=2`} />
                    <CoverTitle>{community.name}</CoverTitle>
                  </CoverLink>
                </CoverPhoto>
                <CoverSubtitle>
                  {community.metaData.members} members
                </CoverSubtitle>

                <ButtonContainer>
                  {community.communityPermissions.isMember
                    ? <OutlineButton
                        onClick={() => this.toggleMembership(community.id)}
                        gradientTheme="none"
                        color={'pro.alt'}
                        hoverColor={'pro.default'}
                      >
                        Joined!
                      </OutlineButton>
                    : <Button
                        onClick={() => this.toggleMembership(community.id)}
                      >
                        Join
                      </Button>}
                </ButtonContainer>
              </Container>
            );
          })}
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
