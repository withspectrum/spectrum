// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../../components/icons';
import { FlexRow, FlexCol } from '../../components/globals';
import { Avatar } from '../../components/avatar';
import {
  ParticipantCount,
  CreatorName,
  ThreadContext,
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

  const participantList = props.data.participants.filter(
    participant => participant.id !== props.data.creator.id
  );

  return (
    <ThreadContext>
      {needsCommunityDetails
        ? <Avatar
            community
            size={32}
            src={props.data.channel.community.profilePhoto}
          />
        : <Avatar size={32} src={props.data.creator.profilePhoto} />}
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
            <CreatorName>
              {props.data.creator.name}
            </CreatorName>
            {participantList.length >= 1 &&
              <ParticipantCount>
                {`+ ${participantList.length - 1} more`}
              </ParticipantCount>}
          </FlexRow>}
      </ThreadContextMeta>
    </ThreadContext>
  );
};

export default FormattedThreadLocation;
