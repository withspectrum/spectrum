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
import {
  StyledThreadFeedCard,
  CardContent,
  CardLink,
  Title,
  Meta,
  MetaNew,
  MetaRow,
  Participant,
  ParticipantCount,
  Creator,
  ParticipantHeads,
  Location,
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
            </Link>
            {' '}/{' '}
            <Link
              to={`/${props.data.channel.community.slug}/${props.data.channel.slug}`}
            >
              {props.data.channel.name}
            </Link>
          </Location>
        );
      case 'community':
        return (
          <Location>
            <Link
              to={`/${props.data.channel.community.slug}/${props.data.channel.slug}`}
            >
              {`~${props.data.channel.name}`}
            </Link>
          </Location>
        );
      case 'channel':
      default:
        return;
    }
  };

  const participantList = props.data.participants;

  const messageAvatars = list => {
    const avatarList = list.slice(0, 10);
    return avatarList.map(participant => (
      <Link key={participant.id} to={`/users/${participant.username}`}>
        <Participant src={`${participant.profilePhoto}`} role="presentation" />
      </Link>
    ));
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
              <Link
                key={props.data.creator.id}
                to={`/users/${props.data.creator.username}`}
              >
                <Participant src={props.data.creator.profilePhoto} />
              </Link>
            </Creator>
            {messageAvatars(participantList)}
            {participantList.length > 10 &&
              <ParticipantCount
              >{`+${participantList.length - 10}`}</ParticipantCount>}
          </ParticipantHeads>
          {props.data.messageCount > 0
            ? <Meta>
                <Icon
                  size={24}
                  glyph="message-fill"
                  tipText={`${props.data.messageCount} ${props.data.messageCount > 1 ? 'messages' : 'message'}`}
                  tipLocation="top-left"
                />
                {props.data.messageCount}
              </Meta>
            : <MetaNew>
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
