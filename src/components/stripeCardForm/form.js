// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { injectStripe, CardElement } from 'react-stripe-elements';
import compose from 'recompose/compose';
import addPaymentSourceMutation from 'shared/graphql/mutations/community/addPaymentSource';
import { addToastWithTimeout } from '../../actions/toasts';
import { style, Actions } from './style';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';

type Props = {
  stripe: Object,
  community: GetCommunitySettingsType,
  addPaymentSource: Function,
  children: Function,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class Form extends React.Component<Props, State> {
  state = { isLoading: false };

  createSource = async () =>
    await this.props.stripe
      .createSource()
      .then(({ source }) => source)
      .catch(err => {
        this.setState({ isLoading: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });

  handleSubmit = async ev => {
    ev.preventDefault();
    this.setState({ isLoading: true });

    const communityId = this.props.community.id;
    const { id: sourceId } = await this.createSource();

    const input = {
      communityId,
      sourceId,
    };

    return this.props
      .addPaymentSource(input)
      .then(() => {
        this.setState({ isLoading: false });
        return this.props.dispatch(
          addToastWithTimeout('success', 'Card saved')
        );
      })
      .catch(err => {
        this.setState({ isLoading: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isLoading } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <CardElement style={style} />
        <Actions>{this.props.children({ isLoading })}</Actions>
      </form>
    );
  }
}

export default compose(injectStripe, connect(), addPaymentSourceMutation)(Form);
