// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AvatarImage from 'src/components/avatar/image';
import Link from 'src/components/link';
import { Button, OutlineButton } from 'src/components/buttons';
import ToggleChannelMembership from 'src/components/toggleChannelMembership';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import type { Dispatch } from 'redux';
import {
  HoverWrapper,
  ProfileCard,
  ChannelCommunityRow,
  ChannelCommunityLabel,
  Content,
  Title,
  Description,
  Actions,
} from './style';

type ProfileProps = {
  channel: GetChannelType,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  innerRef: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

class HoverProfile extends Component<ProfileProps> {
  render() {
    const { channel, innerRef, style } = this.props;

    const {
      isOwner: isChannelOwner,
      isMember: isChannelMember,
    } = channel.channelPermissions;
    const { communityPermissions } = channel.community;
    const {
      isOwner: isCommunityOwner,
      isModerator: isCommunityModerator,
    } = communityPermissions;
    const isGlobalOwner = isChannelOwner || isCommunityOwner;
    const isGlobalModerator = isCommunityModerator;

    return (
      <HoverWrapper popperStyle={style} innerRef={innerRef}>
        <ProfileCard>
          <ChannelCommunityRow to={`/${channel.community.slug}`}>
            <AvatarImage
              size={24}
              src={channel.community.profilePhoto}
              type={'community'}
            />
            <ChannelCommunityLabel>
              {channel.community.name}
            </ChannelCommunityLabel>
          </ChannelCommunityRow>

          <Content>
            <Link to={`/${channel.community.slug}/${channel.slug}`}>
              <Title>{channel.name}</Title>
            </Link>
            {channel.description && (
              <Description>
                {renderTextWithLinks(channel.description)}
              </Description>
            )}
          </Content>

          <Actions>
            {!isGlobalModerator &&
              !isGlobalOwner && (
                <ToggleChannelMembership
                  channel={channel}
                  render={state => (
                    <Button
                      isMember={isChannelMember}
                      icon={isChannelMember ? 'checkmark' : null}
                      loading={state.isLoading}
                    >
                      {isChannelMember ? 'Joined' : `Join ${channel.name}`}
                    </Button>
                  )}
                />
              )}

            {(isGlobalModerator || isGlobalOwner) && (
              <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
                <OutlineButton icon={'settings'}>Settings</OutlineButton>
              </Link>
            )}
          </Actions>
        </ProfileCard>
      </HoverWrapper>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
//$FlowFixMe
export default compose(connect(map), withRouter)(HoverProfile);
