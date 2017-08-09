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
import { FlexRow, FlexCol } from '../../components/globals';
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
  CreatorName,
  ThreadContext,
  ThreadContextMeta,
  ParticipantHeads,
  Location,
  Lock,
  Pinned,
  PinnedBanner,
  PinnedIconWrapper,
} from './style';

const ThreadFeedCardPure = (props: Object): React$Element<any> => {
  const formatLocation = () => {
    console.log('>>', props);
    switch (props.viewContext) {
      case 'dashboard':
      default:
        return (
          <ThreadContext>
            <Avatar
              community
              size={32}
              src={props.data.channel.community.profilePhoto}
            />
            <ThreadContextMeta>
              <Location>
                <Link to={`/${props.data.channel.community.slug}`}>
                  {props.data.channel.community.name}
                </Link>{' '}
                /{' '}
                <Link
                  to={`/${props.data.channel.community.slug}/${props.data
                    .channel.slug}`}
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
              <FlexRow>
                <CreatorName>
                  {props.data.creator.name}
                </CreatorName>
                {participantList.length > 1 &&
                  <ParticipantCount>
                    {`+${participantList.length - 1} more`}
                  </ParticipantCount>}
              </FlexRow>
            </ThreadContextMeta>
          </ThreadContext>
        );
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
        return null;
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
      <CardLink to={`?thread=${props.data.id}`} />
      <CardContent>
        <MetaRow>
          {/* <ParticipantHeads>
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
                onlineSize={'small'}
              />
            </Creator>
            {messageAvatars(participantList)}
            {participantList.length > 10 &&
              <ParticipantCount>{`+${participantList.length -
                10}`}</ParticipantCount>}
          </ParticipantHeads> */}
          {props.data.messageCount > 0
            ? <Meta>
                <Icon size={20} glyph="message-fill" />
                {props.data.messageCount}{' '}
                {props.data.messageCount > 1 ? ' messages' : ' message'}
              </Meta>
            : !props.data.isCreator &&
              <MetaNew>
                <Icon size={20} glyph="post-fill" />
                New thread!
              </MetaNew>}
        </MetaRow>
        <Link to={`?thread=${props.data.id}`}>
          <Title>
            {props.data.content.title}
          </Title>
          {props.isPinned &&
            <Pinned>
              <PinnedBanner />
              <PinnedIconWrapper>
                <Icon glyph="pin-fill" size={24} />
              </PinnedIconWrapper>
            </Pinned>}
        </Link>
        {// for now we know this means there is a link attachment
        props.data.attachments &&
          props.data.attachments.length > 0 &&
          props.data.attachments.map((attachment, i) => {
            if (attachment.attachmentType === 'linkPreview') {
              return (
                <MetaRow>
                  <LinkPreview
                    trueUrl={attachment.data.trueUrl}
                    data={JSON.parse(attachment.data)}
                    size={'small'}
                    editable={false}
                    margin={'8px 0 12px'}
                    key={i}
                  />
                </MetaRow>
              );
            } else {
              return null;
            }
          })}
        {formatLocation()}
      </CardContent>
    </StyledThreadFeedCard>
  );
};

const ThreadFeedCard = compose(pure)(ThreadFeedCardPure);
export default connect()(ThreadFeedCard);
