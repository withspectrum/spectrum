// @flow
import * as React from 'react';
import { Button } from '../../components/Button';
import compose from 'recompose/compose';
import { type GetChannelType } from '../../../shared/graphql/queries/channel/getChannel';
import toggleChannelSubscription, {
  type ToggleChannelSubscriptionType,
  type ToggleChannelSubscriptionProps,
} from '../../../shared/graphql/mutations/channel/toggleChannelSubscription';
import { JoinButtonWrapper } from './style';

type Props = {
  ...$Exact<ToggleChannelSubscriptionProps>,
  channel: GetChannelType,
};

type State = {
  joinedDuringSession: boolean,
  isLoading: boolean,
};

class JoinButton extends React.Component<Props, State> {
  state = {
    isLoading: false,
    joinedDuringSession: false,
  };

  toggleMembership = () => {
    const { channel } = this.props;
    if (!channel || !channel.id) return;

    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId: channel.id })
      .then((result: ToggleChannelSubscriptionType) => {
        const joined =
          result.data.toggleChannelSubscription.channelPermissions.isMember;

        this.setState({
          joinedDuringSession: joined,
          isLoading: false,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const { channel } = this.props;
    const { joinedDuringSession, isLoading } = this.state;

    if (joinedDuringSession) {
      return (
        <JoinButtonWrapper>
          <Button
            onPress={this.toggleMembership}
            state={isLoading ? 'loading' : null}
            icon={'member-remove'}
            title={'Leave channel'}
          />
        </JoinButtonWrapper>
      );
    }

    if (channel.channelPermissions.isMember) return null;

    return (
      <JoinButtonWrapper>
        <Button
          onPress={this.toggleMembership}
          state={isLoading ? 'loading' : null}
          icon={'member-add'}
          title={'Join channel'}
        />
      </JoinButtonWrapper>
    );
  }
}

export default compose(toggleChannelSubscription)(JoinButton);
