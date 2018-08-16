// @flow
import React from 'react';
import Titlebar from '../../../views/titlebar';
import { LoadingThreadDetail } from '../../../components/loading';
import Sidebar from './sidebar';
import {
  ThreadViewContainer,
  ThreadContentView,
  Content,
  Detail,
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
    {threadViewContext === 'fullscreen' && <Sidebar threadViewLoading />}
    <ThreadContentView>
      <Content>
        <Detail type="only">
          <LoadingThreadDetail />
        </Detail>
      </Content>
    </ThreadContentView>
  </ThreadViewContainer>
);

export default LoadingView;
