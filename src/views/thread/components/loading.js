// @flow
import React from 'react';
import Titlebar from '../../../views/titlebar';
import { LoadingThreadDetail, LoadingChat } from '../../../components/loading';
import { HorizontalRule } from '../../../components/globals';
import Icon from '../../../components/icons';
import Sidebar from './sidebar';
import {
  ThreadViewContainer,
  ThreadContentView,
  Content,
  Detail,
  ChatWrapper,
} from '../style';

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
    <Sidebar threadViewLoading />
    <ThreadContentView>
      <Content>
        <Detail type="only">
          <LoadingThreadDetail />
          <ChatWrapper>
            <LoadingChat />
          </ChatWrapper>
        </Detail>
      </Content>
    </ThreadContentView>
  </ThreadViewContainer>
);

export default LoadingView;
