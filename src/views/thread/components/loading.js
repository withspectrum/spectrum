// @flow
import React from 'react';
import { LoadingThreadDetail } from 'src/components/loading';
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
