// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { StyledCommunityProfileCard, Title, Description } from './style';

const CommunityProfileCardPure = (props: Object): React$Element<any> => (
  <StyledCommunityProfileCard>
    <Link to={`/${props.data.slug}`}><Title>{props.data.name}</Title></Link>
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
