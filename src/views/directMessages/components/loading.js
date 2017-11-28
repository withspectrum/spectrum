// @flow
import React from 'react';
import type { ChildrenArray, Node } from 'react';
import Link from 'src/components/link';
import Icon from '../../../components/icons';
import { LoadingDM } from '../../../components/loading';
import Titlebar from '../../titlebar';
import { View, MessagesList, ComposeHeader } from '../style';

export default () => (
  <View>
    <MessagesList>
      <Link to="/messages/new">
        <ComposeHeader>
          <Icon glyph="message-new" />
        </ComposeHeader>
      </Link>
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
