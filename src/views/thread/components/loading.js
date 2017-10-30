// @flow
import React from 'react';
import Titlebar from '../../../views/titlebar';
import { LoadingThreadDetail, LoadingChat } from '../../../components/loading';
import { HorizontalRule } from '../../../components/globals';
import Icon from '../../../components/icons';
import { ThreadViewContainer, Content, Detail, ChatWrapper } from '../style';

const LoadingView = () => (
  <ThreadViewContainer>
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
          <HorizontalRule>
            <hr />
            <Icon glyph={'message'} />
            <hr />
          </HorizontalRule>
          <LoadingChat />
        </ChatWrapper>
      </Detail>
    </Content>
  </ThreadViewContainer>
);

export default LoadingView;
