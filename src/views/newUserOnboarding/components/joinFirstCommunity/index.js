// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { ContinueButton } from '../../style';
import ToggleCommunityMembership from '../../../../components/toggleCommunityMembership';
import {
  Row,
  CoverPhoto,
  Container,
  CoverAvatar,
  CoverTitle,
  CoverDescription,
} from '../discoverCommunities/style';
import { CoverLink, CoverSubtitle } from '../../../../components/profile/style';

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

class JoinFirstCommunityPure extends React.Component<Props> {
  render() {
    const { community } = this.props;

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
          <ToggleCommunityMembership
            community={community}
            render={({ isLoading }) => (
              <ContinueButton loading={isLoading}>
                Join {community.name} and Continue
              </ContinueButton>
            )}
          />
        </Row>
      </Row>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

const JoinFirstCommunity = compose(
  // $FlowIssue
  connect(map)
)(JoinFirstCommunityPure);
export default JoinFirstCommunity;
