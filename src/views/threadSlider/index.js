import React, { useEffect } from 'react';
import type { Location, History, Match } from 'react-router';
import {
  Container,
  Overlay,
  ThreadContainer,
  CloseButton,
  ThreadContainerBackground,
} from './style';
import Icon from 'src/components/icons';
import { ThreadView } from '../thread';
import { ErrorBoundary } from 'src/components/error';
import { ESC } from 'src/helpers/keycodes';

type Props = {
  previousLocation: Location,
  history: History,
  match: Match,
};

const ThreadSlider = (props: Props) => {
  const { previousLocation, history, match } = props;
  const { params } = match;
  const { threadId } = params;

  const closeSlider = (e: any) => {
    e && e.stopPropagation();
    history.push(previousLocation);
  };

  const handleKeyPress = (e: any) => {
    if (e.keyCode === ESC) {
      e.stopPropagation();
      closeSlider();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);
    return () => document.removeEventListener('keydown', handleKeyPress, false);
  }, []);

  return (
    <ErrorBoundary>
      <Container data-cy="thread-slider">
        <Overlay
          onClick={closeSlider}
          data-cy="thread-slider-overlay"
          entered
        />

        <CloseButton data-cy="thread-slider-close" onClick={closeSlider}>
          <Icon glyph="view-close" size={32} />
        </CloseButton>

        <ThreadContainerBackground />

        <ThreadContainer>
          <ThreadView threadId={threadId} threadViewContext={'slider'} slider />
        </ThreadContainer>
      </Container>
    </ErrorBoundary>
  );
};

export default ThreadSlider;
