// @flow
import * as React from 'react';

type Props = {
  mutation: Function,
  variables: any,
  render: Function,
};

type State = {
  isLoading: boolean,
};

class MutationWrapper extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  mutate = () => {
    this.setState({
      isLoading: true,
    });

    this.props.mutation(this.props.variables).then(() => {
      return this.setState({
        isLoading: false,
      });
    });
  };

  render() {
    const { isLoading } = this.state;
    return this.props.render({ isLoading, onPressHandler: this.mutate });
  }
}

export default MutationWrapper;
