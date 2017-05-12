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
import sanitize from 'sanitize-html';
import Remarkable from 'remarkable';
import { toPlainText, toState } from '../editor';
import { openModal } from '../../actions/modals';
import {
  StyledStoryFeedCard,
  CardContent,
  Title,
  Description,
  Meta,
  MetaRow,
  Participant,
  Author,
  ParticipantHeads,
  Location,
} from './style';

const MD = new Remarkable('full');

const StoryFeedCardPure = (props: Object): React$Element<any> => {
  const formatLocation = () => {
    if (!props.data.frequency) {
      return;
    }
    if (props.data.frequency.name && props.data.frequency.community.name) {
      return (
        <Location>
          {`${props.data.frequency.community.name} / ${props.data.frequency.name}`}
        </Location>
      );
    }
    if (props.data.frequency.name && !props.data.frequency.community.name) {
      return (
        <Location>
          {`~/${props.data.frequency.name}`}
        </Location>
      );
    }

    return;
  };

  const openUserProfileModal = (user: Object) => {
    return props.dispatch(openModal('USER_PROFILE_MODAL', { user }));
  };

  const formatStoryPreview = () => {
    // Convert description to plain text
    let md = props.data.content.description;
    if (props.data.content.type === 'SLATE') {
      // Convert Slate state to markdown string
      md = toPlainText(toState(JSON.parse(md)));
    }
    // Render the markdown to HTML, then get rid of the HTML
    // TODO: There's hopefully a better way to do this
    const description = sanitize(MD.render(md), {
      allowedTags: [],
      allowedAttributes: [],
    });
    if (description.length > 150) {
      return (
        <Description>
          {description.substring(1, 140)}...
        </Description>
      );
    } else {
      return <Description>{description}</Description>;
    }
  };

  const participantList = props.data.participants;

  const messageAvatars = list => {
    return list.map(participant => {
      return (
        <Participant
          onClick={() => openUserProfileModal(participant)}
          src={participant.photoURL}
          role="presentation"
          key={participant.uid}
        />
      );
    });
  };

  return (
    <StyledStoryFeedCard>
      <CardContent>
        {formatLocation()}
        <Title>
          <Link to={`/story/${props.data.id}`}>{props.data.content.title}</Link>
        </Title>
        {formatStoryPreview()}
        <MetaRow>
          <ParticipantHeads>
            <Author role="presentation">
              <Participant
                onClick={() => openUserProfileModal(props.data.author)}
                src={props.data.author.photoURL}
              />
            </Author>
            {messageAvatars(participantList)}
          </ParticipantHeads>
          <Meta>{props.data.messageCount} messages</Meta>
        </MetaRow>
      </CardContent>
    </StyledStoryFeedCard>
  );
};

const StoryFeedCard = compose(pure)(StoryFeedCardPure);
export default connect()(StoryFeedCard);
