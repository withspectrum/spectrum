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
import { openModal } from '../../actions/modals';
import {
  StyledThreadFeedCard,
  CardContent,
  Title,
  Description,
  Meta,
  MetaRow,
  Participant,
  Creator,
  ParticipantHeads,
  Location,
} from './style';

const ThreadFeedCardPure = (props: Object): React$Element<any> => {
  const formatLocation = () => {
    if (!props.data.channel) {
      return;
    }
    if (props.data.channel.name && props.data.channel.community.name) {
      return (
        <Location>
          {`${props.data.channel.community.name} / ${props.data.channel.name}`}
        </Location>
      );
    }
    if (props.data.channel.name && !props.data.channel.community.name) {
      return (
        <Location>
          {`~/${props.data.channel.name}`}
        </Location>
      );
    }

    return;
  };

  const openUserProfileModal = (user: Object) => {
    return props.dispatch(openModal('USER_PROFILE_MODAL', { user }));
  };

  const formatThreadPreview = () => {
    if (props.data.content.body.length > 150) {
      return (
        <Description>
          {props.data.content.body.substring(1, 140)}...
        </Description>
      );
    } else {
      return <Description>{props.data.content.body}</Description>;
    }
  };

  const participantList = props.data.participants;

  const messageAvatars = list => {
    return list.map(participant => {
      return (
        <Participant
          onClick={() => openUserProfileModal(participant)}
          src={participant.profilePhoto}
          role="presentation"
          key={participant.id}
        />
      );
    });
  };

  return (
    <StyledThreadFeedCard>
      <CardContent>
        {formatLocation()}
        <Title>
          <Link to={`/thread/${props.data.id}`}>
            {props.data.content.title}
          </Link>
        </Title>
        {formatThreadPreview()}
        <MetaRow>
          <ParticipantHeads>
            <Creator role="presentation">
              <Participant
                onClick={() => openUserProfileModal(props.data.creator)}
                src={props.data.creator.profilePhoto}
              />
            </Creator>
            {messageAvatars(participantList)}
          </ParticipantHeads>
          <Meta>{props.data.messageCount} messages</Meta>
        </MetaRow>
      </CardContent>
    </StyledThreadFeedCard>
  );
};

const ThreadFeedCard = compose(pure)(ThreadFeedCardPure);
export default connect()(ThreadFeedCard);
