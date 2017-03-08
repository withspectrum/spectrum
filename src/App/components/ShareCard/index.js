import React from 'react';
import { track } from '../../../EventTracker';
import { Card } from '../GenericCard/style';
import { SocialButton, Label, Input } from '../../../shared/Globals';
import { Twitter, Facebook } from '../../../shared/Icons';
import { Body, Title, ButtonWrapper } from './style';

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

        <Label>
          Share your new frequency with the world!
          <Input
            onClick={handleFocus}
            onFocus={handleFocus}
            readOnly
            value={`https://spectrum.chat/~${props.slug}`}
          />
        </Label>
        <ButtonWrapper>
          <SocialButton
            onClick={handleClick}
            type={'twitter'}
            reverse={false}
            target="_blank"
            href={
              `https://twitter.com/share?text=${props.name}&url=https://spectrum.chat/~${props.slug}&via=withspectrum`
            }
          >
            <Twitter color={'twitter'} stayActive /> Tweet it!
          </SocialButton>
          <SocialButton
            onClick={handleClick}
            type={'facebook'}
            reverse={false}
            target="_blank"
            href={
              `https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/~${props.slug}`
            }
          >
            <Facebook color={'facebook'} stayActive /> Share on FB!
          </SocialButton>
        </ButtonWrapper>
      </Body>
    </Card>
  );
};

export default ShareCard;
