// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { StyledStoryFeedCard, Title, Description } from './style';

const StoryFeedCardPure = (props: Object): React$Element<any> => (
  <StyledStoryFeedCard>
    <Title>{props.data.content.title}</Title>
    <Description>{props.data.content.description}</Description>
  </StyledStoryFeedCard>
);

const StoryFeedCard = compose(pure)(StoryFeedCardPure);
export default StoryFeedCard;
