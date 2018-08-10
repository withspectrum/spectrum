// @flow
import React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import {
  Button,
  OutlineButton,
  FacebookButton,
  TwitterButton,
} from 'src/components/button';
import { ButtonRow, InputRow, Input } from './style';
import { Description } from '../../style';
import Icon from 'src/components/icon';
import { Loading } from 'src/components/loading';
import Clipboard from 'react-clipboard.js';

const Share = ({ community, history, onboarding }) => {
  if (!community) return <Loading />;

  return (
    <div>
      <ButtonRow>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/${
            community.slug
          }&t=Come hang out with me in the ${
            community.name
          } community on Spectrum!`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookButton>
            <Icon glyph="facebook" />
            Share on Facebook
          </FacebookButton>
        </a>
        <a
          href={`https://twitter.com/share?text=Come hang out with me in the ${
            community.name
          } community on @withspectrum!&url=https://spectrum.chat/${
            community.slug
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterButton>
            <Icon glyph="twitter" />
            Share on Twitter
          </TwitterButton>
        </a>
      </ButtonRow>

      <Clipboard
        component="div"
        data-clipboard-text={`https://spectrum.chat/${community.slug}`}
      >
        <InputRow>
          <Input>{`https://spectrum.chat/${community.slug}`}</Input>
        </InputRow>
      </Clipboard>

      {onboarding && (
        <ButtonRow>
          <Description centered>
            You're ready to start building your community - you can view it now,
            or manage your settings at any time
          </Description>
          <a href={`/${community.slug}/settings`}>
            <OutlineButton>View community settings</OutlineButton>
          </a>
          <a href={`/${community.slug}`}>
            <Button>Go to my community</Button>
          </a>
        </ButtonRow>
      )}
    </div>
  );
};

export default compose(withRouter)(Share);
