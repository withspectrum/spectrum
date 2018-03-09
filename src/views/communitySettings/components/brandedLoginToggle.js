// @flow
import * as React from 'react';
import { Checkbox } from 'src/components/formElements';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import enableBrandedLoginMutation from 'shared/graphql/mutations/community/enableBrandedLogin';
import disableBrandedLoginMutation from 'shared/graphql/mutations/community/disableBrandedLogin';
import { addToastWithTimeout } from '../../../actions/toasts';

type Props = {
  id: string,
  settings: {
    isEnabled: boolean,
  },
  enableBrandedLogin: Function,
  disableBrandedLogin: Function,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class BrandedLoginToggle extends React.Component<Props, State> {
  state = { isLoading: false };

  init = () => {
    this.setState({
      isLoading: true,
    });

    return this.props.settings.isEnabled ? this.disable() : this.enable();
  };

  disable = () => {
    return this.props
      .disableBrandedLogin({ id: this.props.id })
      .then(res => {
        this.props.dispatch(
          addToastWithTimeout('neutral', 'Branded login disabled')
        );
        return this.terminate();
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err));
        return this.terminate();
      });
  };

  enable = () => {
    return this.props
      .enableBrandedLogin({ id: this.props.id })
      .then(res => {
        this.props.dispatch(
          addToastWithTimeout('success', 'Branded login enabled')
        );
        return this.terminate();
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err));
        return this.terminate();
      });
  };

  terminate = () => {
    return this.setState({
      isLoading: false,
    });
  };

  render() {
    const { isEnabled } = this.props.settings;

    return (
      <Checkbox checked={isEnabled} onChange={this.init}>
        Enable custom branded login
      </Checkbox>
    );
  }
}

export default compose(
  connect(),
  enableBrandedLoginMutation,
  disableBrandedLoginMutation
)(BrandedLoginToggle);
