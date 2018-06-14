// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Button } from '../../components/Button';
import compose from 'recompose/compose';
import { type GetChannelType } from '../../../shared/graphql/queries/channel/getChannel';
import toggleChannelSubscription, {
  type ToggleChannelSubscriptionType,
  type ToggleChannelSubscriptionProps,
} from '../../../shared/graphql/mutations/channel/toggleChannelSubscription';
import { JoinButtonWrapper } from './style';
import MutationWrapper from '../../components/MutationWrapper';
import { addToast } from '../../actions/toasts';

type Props = {
  ...$Exact<ToggleChannelSubscriptionProps>,
  channel: GetChannelType,
  dispatch: Dispatch<Object>,
};

type State = {
  joinedDuringSession: boolean,
};

class JoinButton extends React.Component<Props, State> {
  state = {
    isLoading: false,
    joinedDuringSession: false,
  };

  onComplete = (data: ToggleChannelSubscriptionType) => {
    const joined =
      data.data.toggleChannelSubscription.channelPermissions.isMember;

    this.setState({
      joinedDuringSession: joined,
    });
  };

  onError = (err: any) => {
    return this.props.dispatch(
      addToast({
        type: 'error',
        message: err.message,
      })
    );
  };

  render() {
    const { channel } = this.props;
    const { joinedDuringSession } = this.state;

    if (joinedDuringSession) {
      return (
        <JoinButtonWrapper>
          <MutationWrapper
            mutation={this.props.toggleChannelSubscription}
            variables={{ channelId: channel.id }}
            onComplete={this.onComplete}
            onError={this.onError}
            render={({ isLoading, onPressHandler }) => (
              <Button
                onPress={onPressHandler}
                state={isLoading ? 'loading' : null}
                icon={'member-remove'}
                title={'Leave channel'}
              />
            )}
          />
        </JoinButtonWrapper>
      );
    }

    if (channel.channelPermissions.isMember) return null;

    return (
      <JoinButtonWrapper>
        <MutationWrapper
          mutation={this.props.toggleChannelSubscription}
          variables={{ channelId: channel.id }}
          onComplete={this.onComplete}
          onError={this.onError}
          render={({ isLoading, onPressHandler }) => (
            <Button
              onPress={onPressHandler}
              state={isLoading ? 'loading' : null}
              icon={'member-add'}
              title={'Join channel'}
            />
          )}
        />
      </JoinButtonWrapper>
    );
  }
}

export default compose(connect(), toggleChannelSubscription)(JoinButton);
