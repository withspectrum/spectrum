// @flow
import React from 'react';
import { SafeAreaView } from 'react-native';
import ThreadComposer from '../../components/ThreadComposer';
import type { NavigationProps } from 'react-navigation';

type Props = {
  ...$Exact<NavigationProps>,
};

export default (props: Props) => (
  <SafeAreaView>
    <ThreadComposer {...props} />
  </SafeAreaView>
);
