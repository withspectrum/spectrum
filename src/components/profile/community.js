import React, { Component } from 'react';
// $FlowFixMe
import replace from 'string-replace-to-array';
import Card from '../card';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../helpers/events';
import { toggleCommunityMembershipMutation } from '../../api/community';
import { addToastWithTimeout } from '../../actions/toasts';
import { addProtocolToString } from '../../helpers/utils';
import { CLIENT_URL } from '../../api/constants';
import { LoadingProfile } from '../loading';
import Icon from '../icons';
import { Button, OutlineButton } from '../buttons';
import {
  ProfileHeader,
  CommunityAvatar,
  ProfileHeaderLink,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  Title,
  Subtitle,
  Description,
  ExtLink,
  ProfileCard,
  Container,
  CoverPhoto,
  CoverAvatar,
  CoverLink,
  CoverTitle,
  CoverSubtitle,
  CoverDescription,
  ButtonContainer,
} from './style';

// type CommunityProps = {
//   id: string,
//   name: string,
//   slug: string,
//   isMember: boolean,
//   website: string,
//   profilePhoto: string,
//   metaData: {
//     channels: number,
//     members: number,
//   },
//   communityPermissions: {
//     isOwner: boolean,
//     isMember: boolean,
//     isModerator: boolean,
//     isBlocked: boolean,
//   },
// };

class CommunityWithData extends Component {
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

        const str = isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = isMember ? 'success' : 'neutral';
        this.props.dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      data: { community, loading, error },
      profileSize,
      currentUser,
    } = this.props;
    const { isLoading } = this.state;
    const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

    const renderDescriptionWithLinks = text => {
      return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
        <a href={url} target="_blank" rel="noopener nofollower" key={url}>
          {text}
        </a>
      ));
    };

    if (loading) {
      return <LoadingProfile />;
    } else if (!community || error) {
      return null;
    }

    const member = community.communityPermissions.isMember;

    switch (profileSize) {
      case 'upsell':
        return (
          <Container>
            <CoverPhoto url={community.coverPhoto} />
            <CoverLink to={`/${community.slug}`}>
              <CoverAvatar src={community.profilePhoto} community size={64} />
              <CoverTitle>{community.name}</CoverTitle>
            </CoverLink>
            <CoverSubtitle>
              {community.metaData.members.toLocaleString()} members
            </CoverSubtitle>

            <CoverDescription>{community.description}</CoverDescription>

            <ButtonContainer>
              {currentUser ? (
                community.communityPermissions.isMember ? (
                  <OutlineButton
                    onClick={() => this.toggleMembership(community.id)}
                    gradientTheme="none"
                    color={'success.alt'}
                    hoverColor={'success.default'}
                    style={{ fontSize: '16px' }}
                    loading={isLoading}
                  >
                    Joined!
                  </OutlineButton>
                ) : (
                  <Button
                    onClick={() => this.toggleMembership(community.id)}
                    loading={isLoading}
                    color={'success.alt'}
                    gradientTheme={'success'}
                    style={{ fontSize: '16px' }}
                  >
                    Join
                  </Button>
                )
              ) : (
                <Link to={`/login?r=${CLIENT_URL}/${community.slug}`}>
                  <Button
                    gradientTheme={'success'}
                    style={{ fontSize: '16px' }}
                  >
                    Join
                  </Button>
                </Link>
              )}
            </ButtonContainer>
          </Container>
        );
      case 'full':
        return (
          <Card>
            <ProfileHeader>
              <CommunityAvatar
                community
                size={40}
                src={community.profilePhoto}
              />
              <ProfileHeaderLink to={`/${community.slug}`}>
                <ProfileHeaderMeta>
                  <Title>{community.name}</Title>
                </ProfileHeaderMeta>
              </ProfileHeaderLink>
              {currentUser &&
                community.communityPermissions.isOwner && (
                  <Link to={`/${community.slug}/settings`}>
                    <ProfileHeaderAction
                      glyph="settings"
                      tipText="Edit community"
                      tipLocation="top-left"
                    />
                  </Link>
                )}
            </ProfileHeader>
            <Description>
              {renderDescriptionWithLinks(community.description)}

              {community.website && (
                <ExtLink>
                  <Icon glyph="link" size={24} />
                  <a href={addProtocolToString(community.website)}>
                    {community.website}
                  </a>
                </ExtLink>
              )}
            </Description>
          </Card>
        );
      case 'listItemWithAction':
        return (
          <ProfileHeader>
            <CommunityAvatar community src={community.profilePhoto} />
            <ProfileHeaderLink to={`/${community.slug}`}>
              <ProfileHeaderMeta>
                <Title>{community.name}</Title>
                {community.metaData && (
                  <Subtitle>
                    {community.metaData.members.toLocaleString()} members
                  </Subtitle>
                )}
              </ProfileHeaderMeta>
            </ProfileHeaderLink>
            {currentUser &&
              member && (
                <Button
                  loading={isLoading}
                  icon="checkmark"
                  gradientTheme="none"
                  color="text.placeholder"
                  hoverColor="text.placeholder"
                  onClick={() => this.toggleMembership(community.id)}
                >
                  Joined
                </Button>
              )}
            {currentUser &&
              !member && (
                <Button
                  loading={isLoading}
                  icon="plus-fill"
                  gradientTheme="success"
                  onClick={() => this.toggleMembership(community.id)}
                >
                  Join
                </Button>
              )}
          </ProfileHeader>
        );
      case 'miniWithAction':
        return (
          <ProfileCard>
            <ProfileHeader>
              <CommunityAvatar community src={community.profilePhoto} />
              <ProfileHeaderLink to={`/${community.slug}`}>
                <ProfileHeaderMeta>
                  <Title>{community.name}</Title>
                  {community.metaData && (
                    <Subtitle>{community.metaData.members}</Subtitle>
                  )}
                </ProfileHeaderMeta>
              </ProfileHeaderLink>
              {currentUser &&
                member && (
                  <Button
                    loading={isLoading}
                    icon="checkmark"
                    gradientTheme="none"
                    color="text.placeholder"
                    hoverColor="text.placeholder"
                    onClick={() => this.toggleMembership(community.id)}
                  >
                    Joined
                  </Button>
                )}
              {currentUser &&
                !member && (
                  <Button
                    loading={isLoading}
                    icon="plus-fill"
                    gradientTheme="success"
                    onClick={() => this.toggleMembership(community.id)}
                  >
                    Join
                  </Button>
                )}
            </ProfileHeader>
          </ProfileCard>
        );
      case 'default':
      default:
        return (
          <Card>
            <ProfileHeader>
              <CommunityAvatar src={`${community.profilePhoto}?w=40&dpr=2`} />
              <ProfileHeaderLink to={`/${community.slug}`}>
                <ProfileHeaderMeta>
                  <Title>{community.name}</Title>
                </ProfileHeaderMeta>
              </ProfileHeaderLink>

              {currentUser &&
                !community.communityPermissions.isOwner && (
                  <ProfileHeaderAction
                    glyph={
                      community.communityPermissions.isMember
                        ? 'minus'
                        : 'plus-fill'
                    }
                    color={
                      community.communityPermissions.isMember
                        ? 'text.placeholder'
                        : 'brand.alt'
                    }
                    hoverColor={
                      community.communityPermissions.isMember
                        ? 'warn.default'
                        : 'brand.alt'
                    }
                    tipText={
                      community.communityPermissions.isMember
                        ? `Leave community`
                        : 'Join community'
                    }
                    tipLocation="top-left"
                    onClick={() => this.toggleMembership(community.id)}
                  />
                )}

              {currentUser &&
                community.communityPermissions.isOwner && (
                  <Link to={`/${community.slug}/settings`}>
                    <ProfileHeaderAction
                      glyph="settings"
                      tipText="Edit community"
                      tipLocation="top-left"
                    />
                  </Link>
                )}
            </ProfileHeader>
          </Card>
        );
    }
  }
}

const Community = compose(toggleCommunityMembershipMutation)(CommunityWithData);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(Community);
