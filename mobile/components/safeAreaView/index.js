// @flow
import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SafeAreaView } from 'react-native';

export default function withSafeAreaView(
  WrappedComponent: React.Node
): () => React.Node {
  function EnhancedComponent(props: any) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#CCC' }}>
        <WrappedComponent {...props} />
      </SafeAreaView>
    );
  }
  return hoistNonReactStatics(EnhancedComponent, WrappedComponent);
}
