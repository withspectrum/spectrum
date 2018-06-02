// @flow
import React, { type Node } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SafeAreaView } from 'react-native';

export default function withSafeAreaView(WrappedComponent: Node): () => Node {
  function EnhancedComponent(props: any) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#CCC' }}>
        {/* $FlowFixMe */}
        <WrappedComponent {...props} />
      </SafeAreaView>
    );
  }
  return hoistNonReactStatics(EnhancedComponent, WrappedComponent);
}
