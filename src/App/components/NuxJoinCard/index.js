import React from 'react';
import { Wrapper } from '../Card/style';
import { Button } from '../../../shared/Globals';
import { featured } from '../../../helpers/featuredFrequencies';
import {
  Body,
  Title,
  Description,
  Hscroll,
  FreqCard,
  RightPadding,
  Actions,
} from './style';

const NuxJoinCard = props => {
  return (
    <Wrapper static overflow={'visible'}>
      <Body>
        <Description emoji>👋</Description>
        <Title>Discover Frequencies</Title>
        <Description>
          Explore some of the communities on Spectrum and join the conversation.
        </Description>

        <Hscroll>
          {featured.map((freq, i) => {
            return (
              <FreqCard key={i}>
                <div>
                  <img src="#" />
                  <h3>{freq.title}</h3>
                  <h4>{freq.description}</h4>
                </div>
                <Actions>
                  <Button width={'100%'}>Join</Button>
                </Actions>
              </FreqCard>
            );
          })}
          <RightPadding />
        </Hscroll>
      </Body>
    </Wrapper>
  );
};

export default NuxJoinCard;
