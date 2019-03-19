// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Icon from 'src/components/icons';
import JoinChannelWrapper from 'src/components/joinChannelWrapper';
import LeaveChannelWrapper from 'src/components/leaveChannelWrapper';
import {
  SmallOutlineButton,
  SmallPrimaryButton,
} from 'src/views/community/components/button';
import { Row, Content, Label, Description, Actions } from './style';

type Props = {
  channel: ?ChannelInfoType,
  id: string,
  name?: string,
  description?: ?string,
  currentUser: ?Object,
  children?: React$Node,
};

const Channel = (props: Props) => {
  const { channel, name, description, children, currentUser } = props;
  if (!channel) return null;

  const renderAction = () => {
    const chevron = <Icon glyph="view-forward" size={24} />;
    if (!currentUser) return chevron;

    const { community, channelPermissions } = channel;
    const { communityPermissions } = community;

    const isCommunityMember = communityPermissions.isMember;
    if (!isCommunityMember) return chevron;

    const { isMember } = channelPermissions;
    if (isMember)
      return (
        <LeaveChannelWrapper
          channel={channel}
          render={({ isLoading, isHovering }) => (
            <SmallOutlineButton style={{ width: '100px' }}>
              {isLoading ? 'Leaving...' : isHovering ? 'Leave' : 'Member'}
            </SmallOutlineButton>
          )}
        />
      );

    return (
      <JoinChannelWrapper
        channel={channel}
        render={({ isLoading }) => (
          <SmallPrimaryButton>
            {isLoading ? 'Joining...' : 'Join'}
          </SmallPrimaryButton>
        )}
      />
    );
  };

  return (
    <ErrorBoundary>
      <Link to={`/${channel.community.slug}/${channel.slug}`}>
        <Row>
          <Content>
            {name && (
              <Label>
                {channel.isPrivate && (
                  <Icon glyph="private-outline" size={14} />
                )}

                {name}
              </Label>
            )}

            {description && <Description>{description}</Description>}
          </Content>

          <Actions>
            {renderAction()}
            {children}
          </Actions>
        </Row>
      </Link>
    </ErrorBoundary>
  );
};

export const ChannelListItem = compose(withCurrentUser)(Channel);
