// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { addToastWithTimeout } from '../../../actions/toasts';

type Props = {
  onMutationEnd: Function,
  mutation: ?Function,
  variables: any,
  dispatch: Function,
  render: ({ isLoading: boolean }) => any,
};

type State = {
  isLoading: boolean,
  isMounted?: boolean,
};

class MutationWrapper extends React.Component<Props, State> {
  initialState = { isLoading: false, isMounted: false };
  state = this.initialState;

  componentDidMount() {
    this.setState({
      isMounted: true,
    });
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false,
    });
  }

  init = () => {
    if (!this.props.mutation) return;
    if (this.state.isMounted) this.setState({ isLoading: true });
    return this.mutate();
  };

  terminate = () => {
    this.props.onMutationEnd();
    if (!this.state.isMounted) return;
    return this.setState(this.initialState);
  };

  mutate = () => {
    if (!this.props.mutation) return;
    return this.props
      .mutation(this.props.variables.input)
      .then(() => {
        this.props.dispatch(addToastWithTimeout('success', 'Saved'));
        return this.terminate();
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
        return this.terminate();
      });
  };

  render() {
    return (
      <div onClick={this.init}>
        {this.props.render({ isLoading: this.state.isLoading })}
      </div>
    );
  }
}

export default connect()(MutationWrapper);
