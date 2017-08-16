// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../../components/icons';
import { FlexRow } from '../../components/globals';
import { Avatar } from '../../components/avatar';
import {
  CreatorName,
  ThreadContext,
  ThreadContextAvatar,
  ThreadContextMeta,
  Location,
  Lock,
} from './style';

const FormattedThreadLocation = props => {
  const needsCommunityDetails =
    props.viewContext === 'dashboard' || props.viewContext === 'profile';

  const needsChannelDetails =
    props.viewContext === 'dashboard' ||
    props.viewContext === 'profile' ||
    props.viewContext === 'community';

  const needsAuthorDetails =
    props.viewContext === 'dashboard' ||
    props.viewContext === 'community' ||
    props.viewContext === 'channel';

  return (
    <ThreadContext>
      {needsCommunityDetails &&
        <ThreadContextAvatar>
          <Avatar
            community
            size={24}
            src={props.data.channel.community.profilePhoto}
          />
        </ThreadContextAvatar>}
      <ThreadContextMeta>
        {(needsCommunityDetails || needsChannelDetails) &&
          <Location>
            {needsCommunityDetails &&
              <Link to={`/${props.data.channel.community.slug}`}>
                {props.data.channel.community.name}
              </Link>}
            {needsCommunityDetails &&
              needsChannelDetails &&
              <span>
                {' / '}
              </span>}
            {needsChannelDetails &&
              <Link
                to={`/${props.data.channel.community.slug}/${props.data.channel
                  .slug}`}
              >
                {props.data.channel.isPrivate &&
                  <Lock>
                    <Icon
                      glyph="private"
                      tipText={'Private channel'}
                      tipLocation="top-right"
                      size={12}
                    />
                  </Lock>}
                {props.data.channel.name}
              </Link>}
          </Location>}
        {needsAuthorDetails &&
          <FlexRow>
            {needsAuthorDetails &&
              <FlexRow>
                <CreatorName>
                  {props.data.creator.name}
                </CreatorName>
              </FlexRow>}
          </FlexRow>}
      </ThreadContextMeta>
    </ThreadContext>
  );
};

export default FormattedThreadLocation;
