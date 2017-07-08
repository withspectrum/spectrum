// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
import { LinkPreview } from '../../components/linkPreview';
import Icon from '../../components/icons';
import { Avatar } from '../../components/avatar';
import {
  StyledThreadFeedCard,
  CardContent,
  CardLink,
  Title,
  Meta,
  MetaNew,
  MetaRow,
  ParticipantCount,
  Creator,
  ParticipantHeads,
  Location,
  Lock,
} from './style';

const ThreadFeedCardPure = (props: Object): React$Element<any> => {
  const formatLocation = () => {
    switch (props.viewContext) {
      case 'dashboard':
      case 'profile':
        return (
          <Location>
            <Link to={`/${props.data.channel.community.slug}`}>
              {props.data.channel.community.name}
            </Link>{' '}
            /{' '}
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
            </Link>
          </Location>
        );
      case 'community':
        return (
          <Location>
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
            </Link>
          </Location>
        );
      case 'channel':
      default:
        return;
    }
  };

  const participantList = props.data.participants.filter(
    participant => participant.id !== props.data.creator.id
  );

  const messageAvatars = list => {
    const avatarList = list.slice(0, 10);
    return avatarList.map(participant =>
      <Avatar
        size={24}
        radius={24}
        isOnline={participant.isOnline}
        link={participant.username ? `/users/${participant.username}` : null}
        src={participant.profilePhoto}
        role="presentation"
        key={participant.id}
      />
    );
  };

  return (
    <StyledThreadFeedCard hoverable>
      <CardLink to={`/thread/${props.data.id}`} />
      <CardContent>
        {formatLocation()}
        <Link to={`/thread/${props.data.id}`}>
          <Title>
            {props.data.content.title}
          </Title>
        </Link>
        <MetaRow>
          {// for now we know this means there is a link attachment
          props.data.attachments &&
            props.data.attachments.length > 0 &&
            props.data.attachments.map((attachment, i) => {
              if (attachment.attachmentType === 'linkPreview') {
                return (
                  <LinkPreview
                    trueUrl={attachment.data.trueUrl}
                    data={JSON.parse(attachment.data)}
                    size={'small'}
                    editable={false}
                    margin={'8px 0 12px'}
                    key={i}
                  />
                );
              } else {
                return <span key={i} />;
              }
            })}
        </MetaRow>
        <MetaRow>
          <ParticipantHeads>
            {/* TODO: Creator/participants should all be links, not fire modals. */}
            <Creator role="presentation">
              <Avatar
                size={24}
                radius={24}
                isOnline={props.data.creator.isOnline}
                src={props.data.creator.profilePhoto}
                link={
                  props.data.creator.username
                    ? `/users/${props.data.creator.username}`
                    : null
                }
                role="presentation"
                key={props.data.creator.id}
              />
            </Creator>
            {messageAvatars(participantList)}
            {participantList.length > 10 &&
              <ParticipantCount>{`+${participantList.length -
                10}`}</ParticipantCount>}
          </ParticipantHeads>
          {props.data.messageCount > 0
            ? <Meta>
                <Icon
                  size={24}
                  glyph="message-fill"
                  tipText={`${props.data.messageCount} ${props.data
                    .messageCount > 1
                    ? 'messages'
                    : 'message'}`}
                  tipLocation="top-left"
                />
                {props.data.messageCount}
              </Meta>
            : !props.data.isCreator &&
              <MetaNew>
                <Icon
                  size={24}
                  glyph="notification-fill"
                  tipText={`New thread!`}
                  tipLocation="top-left"
                />
                New
              </MetaNew>}
        </MetaRow>
      </CardContent>
    </StyledThreadFeedCard>
  );
};

const ThreadFeedCard = compose(pure)(ThreadFeedCardPure);
export default connect()(ThreadFeedCard);
