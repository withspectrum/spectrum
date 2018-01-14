// @flow
import * as React from 'react';

export const mapNavigationStateParamsToProps = SomeComponent => {
  return class extends React.Component {
    static navigationOptions = SomeComponent.navigationOptions; // better use hoist-non-react-statics
    render() {
      const { navigation: { state: { params } } } = this.props;
      return <SomeComponent {...params} {...this.props} />;
    }
  };
};
