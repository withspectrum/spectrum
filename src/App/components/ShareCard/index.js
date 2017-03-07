import React from 'react';
import { track } from '../../../EventTracker';
import { Card } from '../GenericCard/style';
import { Body, Title, Desc, Input, ButtonWrapper, Button } from './style';

const ShareCard = props => {
  const handleFocus = e => {
    e.target.select();
    track('share card', 'focused', null);
  };

  const handleClick = e => {
    e.preventDefault();
    track('share card', 'clicked', null);
  };

  return (
    <Card static>

      <Body>
        <Title>Get the conversation started.</Title>

        <Desc>Share your new frequency with the world!</Desc>
        <Input
          onClick={handleFocus}
          onFocus={handleFocus}
          readOnly
          value={`https://spectrum.chat/~${props.slug}`}
        />
        <ButtonWrapper>
          <Button
            onClick={handleClick}
            type={'twitter'}
            target="_blank"
            href={
              `https://twitter.com/share?text=${props.name}&url=https://spectrum.chat/~${props.slug}&via=withspectrum`
            }
          >
            Share on Twitter
          </Button>
          <Button
            onClick={handleClick}
            type={'facebook'}
            target="_blank"
            href={
              `https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/~${props.slug}`
            }
          >
            Post to Facebook
          </Button>
        </ButtonWrapper>
      </Body>
    </Card>
  );
};

export default ShareCard;
