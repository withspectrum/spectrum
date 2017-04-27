// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { StyledCommunityProfileCard, Title, Description } from './style';

const CommunityProfileCardPure = (props: Object): React$Element<any> => (
  <StyledCommunityProfileCard>
    <Title>{props.data.name}</Title>
    <Description>
      {props.data.frequencyConnection.edges.length}
      {props.data.frequencyConnection.edges.length > 1 ||
        props.data.frequencyConnection.edges.length === 0
        ? ' frequencies'
        : ' frequency'}
    </Description>
  </StyledCommunityProfileCard>
);

const CommunityProfileCard = compose(pure)(CommunityProfileCardPure);
export default CommunityProfileCard;
