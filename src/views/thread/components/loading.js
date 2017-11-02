// @flow
import React from 'react';
import Titlebar from '../../../views/titlebar';
import { LoadingThreadDetail, LoadingChat } from '../../../components/loading';
import { HorizontalRule } from '../../../components/globals';
import Icon from '../../../components/icons';
import { ThreadViewContainer, Content, Detail, ChatWrapper } from '../style';

type PropTypes = {
  threadViewContext?: 'fullscreen' | 'inbox' | 'slider',
};
const LoadingView = ({ threadViewContext = 'fullscreen' }: PropTypes) => (
  <ThreadViewContainer threadViewContext={threadViewContext}>
    <Titlebar
      provideBack={true}
      backRoute={`/`}
      noComposer
      style={{ gridArea: 'header' }}
    />
    <Content>
      <Detail type="only">
        <LoadingThreadDetail />
        <ChatWrapper>
          <LoadingChat />
        </ChatWrapper>
      </Detail>
    </Content>
  </ThreadViewContainer>
);

export default LoadingView;
