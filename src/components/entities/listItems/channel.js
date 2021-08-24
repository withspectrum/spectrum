// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Icon from 'src/components/icon';
import {
  ChannelRow,
  ChannelContent,
  Label,
  Description,
  ChannelActions,
} from './style';

type Props = {
  channel: ?ChannelInfoType,
  id: string,
  name?: string,
  description?: ?string,
  currentUser: ?Object,
  children?: React$Node,
  isActive?: boolean,
};

const Channel = (props: Props) => {
  const { channel, name, description, children, isActive = false } = props;
  if (!channel) return null;

  return (
    <ErrorBoundary>
      <ChannelRow isActive={isActive}>
        <Link to={`/${channel.community.slug}/${channel.slug}?tab=posts`}>
          <ChannelContent>
            {name && (
              <Label title={name}>
                {channel.isPrivate && (
                  <Icon glyph="private-outline" size={14} />
                )}
                # {name}
              </Label>
            )}

            {description && <Description>{description}</Description>}
          </ChannelContent>
        </Link>

        <ChannelActions>{children}</ChannelActions>
      </ChannelRow>
    </ErrorBoundary>
  );
};

export const ChannelListItem = compose(withCurrentUser)(Channel);
