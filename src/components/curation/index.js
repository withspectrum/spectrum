// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import { Link } from 'react-router-dom';
import { track } from '../../helpers/events';
import { addToastWithTimeout } from '../../actions/toasts';
import { toggleCommunityMembershipMutation } from '../../api/community';
import { FlexRow } from '../globals';
import { Loading } from '../loading';
import Icon from '../icons';

import {
  FeaturePhoto,
  Title,
  ProfileLink,
  JoinButton,
  MemberButton,
  Feature,
  FeatureWrapper,
  FeatureLabel,
  FeaturePresentation,
  FeatureDescription,
  Description,
  NullDescription,
  Tag,
} from './style';

const isMobile = window.innerWidth < 768;

export const FeaturedCommunityWithData = props => {
  const {
    data: { loading, error, community },
    toggleCommunityMembership,
    dispatch,
    notes,
    currentUser,
  } = props;

  const toggleMembership = communityId => {
    toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        track('community', isMember ? 'joined' : 'unjoined', null);

        const str = isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = isMember ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const returnButton = () => {
    if (currentUser && !community.communityPermissions.isMember) {
      return (
        <JoinButton
          icon="plus-fill"
          gradientTheme="success"
          onClick={() => toggleMembership(community.id)}
        >
          Join
        </JoinButton>
      );
    } else if (currentUser && community.communityPermissions.isMember) {
      return (
        <Link to={`/${community.slug}`}>
          <MemberButton icon="checkmark" gradientTheme="none">
            Member
          </MemberButton>
        </Link>
      );
    } else {
      return <div />;
    }
  };

  if (loading) {
    return <Loading size={48} />;
  } else if (error || !community) {
    return (
      <FeatureDescription>
        <Title>
          Explore Spectrum
        </Title>
        <NullDescription>
          Discover and join new communities!
        </NullDescription>
      </FeatureDescription>
    );
  } else {
    return (
      <FeatureWrapper>
        <FeatureLabel>Featured Community</FeatureLabel>
        <Feature>
          <FeaturePresentation>
            <Link to={`/${community.slug}`}>
              <FeaturePhoto src={`${community.profilePhoto}?w=120&dpr=2`} />
            </Link>
            {returnButton()}
          </FeaturePresentation>
          <FeatureDescription>
            <ProfileLink to={`/${community.slug}`}>
              <Title>{community.name}</Title>
              {' '}
              <FlexRow>Visit <Icon glyph="view-forward" size={16} /></FlexRow>
            </ProfileLink>
            <Description>{community.description}</Description>
            <Tag>Editor's note</Tag>
            <Description>{notes}</Description>
          </FeatureDescription>
          {returnButton()}
        </Feature>
      </FeatureWrapper>
    );
  }
};

const mapStateToProps = state => ({ currentUser: state.users.currentUser });

export const FeaturedCommunity = compose(
  toggleCommunityMembershipMutation,
  connect(mapStateToProps),
  pure
)(FeaturedCommunityWithData);
