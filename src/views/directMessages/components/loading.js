// @flow
import React from 'react';
import { LoadingDM } from 'src/components/loading';
import { View, MessagesList } from '../style';

export default () => (
  <View>
    <MessagesList>
      <div>
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
      </div>
    </MessagesList>
  </View>
);
