// @flow
import * as React from 'react';
import Card from '../card';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import addProtocolToString from 'shared/normalize-url';
import { CLIENT_URL } from '../../api/constants';
import { LoadingProfile } from '../loading';
import Icon from '../icons';
import { CommunityAvatar } from '../avatar';
import { Button, OutlineButton } from '../buttons';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import ToggleCommunityMembership from '../toggleCommunityMembership';
import type { Dispatch } from 'redux';
import {
  ProfileHeader,
  ProfileHeaderLink,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  Title,
  FullTitle,
  FullProfile,
  Subtitle,
  FullDescription,
  ExtLink,
  ProfileCard,
  Container,
  CoverPhoto,
  CoverLink,
  CoverTitle,
  CoverDescription,
  ButtonContainer,
} from './style';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';

type Props = {
  onJoin: Function,
  onLeave: Function,
  joinedCommunity?: Function,
  joinedFirstCommunity?: Function,
  dispatch: Dispatch<Object>,
  data: {
    community: GetCommunityType,
    loading: boolean,
    error: ?string,
  },
  profileSize: ?string,
  currentUser: ?Object,
  showHoverProfile?: boolean,
};

class CommunityWithData extends React.Component<Props> {
  onJoin = community => {
    this.props.joinedCommunity && this.props.joinedCommunity(1, false);
    this.props.onJoin && this.props.onJoin(community);
  };

  onLeave = community => {
    this.props.joinedCommunity && this.props.joinedCommunity(-1, false);
    this.props.onLeave && this.props.onLeave(community);
  };

  render() {
    const {
      data: { community, loading, error },
      profileSize,
      currentUser,
      showHoverProfile = true,
    } = this.props;

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
              <CommunityAvatar
                community={community}
                showHoverProfile={showHoverProfile}
                size={64}
                style={{
                  boxShadow: '0 0 0 2px #fff',
                  flex: '0 0 64px',
                  marginRight: '0',
                }}
              />
              <CoverTitle>{community.name}</CoverTitle>
            </CoverLink>

            {community.description && (
              <CoverDescription>
                {renderTextWithLinks(community.description)}
              </CoverDescription>
            )}

            <ButtonContainer>
              {currentUser ? (
                community.communityPermissions.isMember ? (
                  <ToggleCommunityMembership
                    onJoin={this.onJoin}
                    onLeave={this.onLeave}
                    community={community}
                    render={({ isLoading }) => (
                      <OutlineButton
                        gradientTheme="none"
                        color={'success.alt'}
                        hoverColor={'success.default'}
                        style={{ fontSize: '16px' }}
                        loading={isLoading}
                      >
                        Joined!
                      </OutlineButton>
                    )}
                  />
                ) : (
                  <ToggleCommunityMembership
                    onJoin={this.onJoin}
                    onLeave={this.onLeave}
                    community={community}
                    render={({ isLoading }) => (
                      <Button
                        loading={isLoading}
                        color={'success.alt'}
                        gradientTheme={'success'}
                        style={{ fontSize: '16px' }}
                      >
                        Join
                      </Button>
                    )}
                  />
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
          <FullProfile>
            <CommunityAvatar
              community={community}
              size={128}
              mobilesize={64}
              showHoverProfile={showHoverProfile}
              style={{ marginRight: '16px', boxShadow: '0 0 0 2px #fff' }}
            />
            <ProfileHeaderMeta>
              <FullTitle>{community.name}</FullTitle>
            </ProfileHeaderMeta>
            <FullDescription>
              {community.description && (
                <p>{renderTextWithLinks(community.description)}</p>
              )}

              {community.website && (
                <ExtLink>
                  <Icon glyph="link" size={24} />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={addProtocolToString(community.website)}
                  >
                    {community.website}
                  </a>
                </ExtLink>
              )}
            </FullDescription>
          </FullProfile>
        );
      case 'listItemWithAction':
        return (
          <ProfileHeader>
            <CommunityAvatar
              community={community}
              showHoverProfile={showHoverProfile}
              style={{ marginRight: '16px' }}
            />
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
                <ToggleCommunityMembership
                  onJoin={this.onJoin}
                  onLeave={this.onLeave}
                  community={community}
                  render={({ isLoading }) => (
                    <Button
                      loading={isLoading}
                      icon="checkmark"
                      gradientTheme="none"
                      color="text.placeholder"
                      hoverColor="text.placeholder"
                    >
                      Joined
                    </Button>
                  )}
                />
              )}
            {currentUser &&
              !member && (
                <ToggleCommunityMembership
                  onJoin={this.onJoin}
                  onLeave={this.onLeave}
                  community={community}
                  render={({ isLoading }) => (
                    <Button
                      loading={isLoading}
                      icon="plus-fill"
                      gradientTheme="success"
                    >
                      Join
                    </Button>
                  )}
                />
              )}
          </ProfileHeader>
        );
      case 'miniWithAction':
        return (
          <ProfileCard>
            <ProfileHeader>
              <CommunityAvatar
                community={community}
                showHoverProfile={showHoverProfile}
                style={{ marginRight: '16px' }}
              />
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
                  <ToggleCommunityMembership
                    onJoin={this.onJoin}
                    onLeave={this.onLeave}
                    community={community}
                    render={({ isLoading }) => (
                      <Button
                        loading={isLoading}
                        icon="checkmark"
                        gradientTheme="none"
                        color="text.placeholder"
                        hoverColor="text.placeholder"
                      >
                        Joined
                      </Button>
                    )}
                  />
                )}
              {currentUser &&
                !member && (
                  <ToggleCommunityMembership
                    onJoin={this.onJoin}
                    onLeave={this.onLeave}
                    community={community}
                    render={({ isLoading }) => (
                      <Button
                        loading={isLoading}
                        icon="plus-fill"
                        gradientTheme="success"
                      >
                        Join
                      </Button>
                    )}
                  />
                )}
            </ProfileHeader>
          </ProfileCard>
        );
      case 'default':
      default:
        return (
          <Card>
            <ProfileHeader>
              <CommunityAvatar
                community={community}
                showHoverProfile={showHoverProfile}
                style={{ marginRight: '16px' }}
              />
              <ProfileHeaderLink to={`/${community.slug}`}>
                <ProfileHeaderMeta>
                  <Title>{community.name}</Title>
                </ProfileHeaderMeta>
              </ProfileHeaderLink>

              {currentUser &&
                !community.communityPermissions.isOwner && (
                  <ToggleCommunityMembership
                    onJoin={this.onJoin}
                    onLeave={this.onLeave}
                    community={community}
                    render={({ isLoading }) => (
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
                            ? 'Leave community'
                            : 'Join community'
                        }
                        loading={isLoading}
                        tipLocation="top-left"
                      />
                    )}
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

const mapStateToProps = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(mapStateToProps)
)(CommunityWithData);
