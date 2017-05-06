// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { Link } from 'react-router-dom';
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

const StoryFeedCardPure = (props: Object): React$Element<any> => {
  const formatLocation = () => {
    if (props.data.frequency.name && props.data.frequency.community.name) {
      return (
        <Location
        >{`${props.data.frequency.community.name} / ${props.data.frequency.name}`}</Location>
      );
    } else if (
      props.data.frequency.name && !props.data.frequency.community.name
    ) {
      return <Location>{`~/${props.data.frequency.name}`}</Location>;
    } else {
      ('');
    }
  };

  const formatStoryPreview = () => {
    if (props.data.content.description.length > 150) {
      return (
        <Description>
          {props.data.content.description.substring(1, 140)}...
        </Description>
      );
    } else {
      return <Description>{props.data.content.description}</Description>;
    }
  };

  const participantList = props.data.messageConnection.edges;

  const messageAvatars = list => {
    return list.map((edge, i) => {
      const participant = edge.node.sender;
      return (
        <Participant src={participant.photoURL} role="presentation" key={i} />
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
              <Participant src={props.data.author.photoURL} />
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
export default StoryFeedCard;
