// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { StyledStoryFeedCard, Title, Description, Meta } from './style';

const StoryFeedCardPure = (props: Object): React$Element<any> => (
  <StyledStoryFeedCard>
    <Title>
      <Link to={`/story/${props.data.id}`}>{props.data.content.title}</Link>
    </Title>
    <Description>{props.data.content.description}</Description>
    <Meta>{props.data.messageCount} messages</Meta>
  </StyledStoryFeedCard>
);

const StoryFeedCard = compose(pure)(StoryFeedCardPure);
export default StoryFeedCard;
