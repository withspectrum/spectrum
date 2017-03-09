import React from 'react';
import { Wrapper } from '../Card/style';
import { Body, Title, Description } from './style';

const NuxJoinCard = props => {
  return (
    <Wrapper static>
      <Body>
        <Title>Let's find some communities!</Title>
        <Description>
          Checkout some of the frequencies in the navigation to the left to see what's going on.
        </Description>
        <Description emoji>👈</Description>
      </Body>
    </Wrapper>
  );
};

export default NuxJoinCard;
