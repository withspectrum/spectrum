// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import {
  SlackChannelRow,
  ChannelName,
  StyledSelect,
  Select,
  SendsTo,
} from './style';
import { addToastWithTimeout } from 'src/actions/toasts';
import updateChannelSlackBotConnectionMutation from 'shared/graphql/mutations/channel/updateChannelSlackBotConnection';

type SlackChannel = {
  id: string,
  name: string,
};

type ChannelWithSlackSettings = {
  ...$Exact<ChannelInfoType>,
  slackSettings: {
    botConnection: {
      threadCreated: ?string,
    },
  },
};

type Props = {
  slackChannels: Array<SlackChannel>,
  channel: ChannelWithSlackSettings,
  updateChannelSlackBotConnection: Function,
  dispatch: Function,
};

class ChannelSlackManager extends React.Component<Props> {
  handleSlackChannelChange = e => {
    const { value } = e.target;
    const { channel, dispatch, updateChannelSlackBotConnection } = this.props;
    const type = 'THREAD_CREATED';
    const input = {
      slackChannelId: value,
      channelId: channel.id,
      eventType: type,
    };

    return updateChannelSlackBotConnection(input)
      .then(() => dispatch(addToastWithTimeout('success', 'Settings saved')))
      .catch(err => dispatch(addToastWithTimeout('error', err.message)));
  };

  render() {
    const { slackChannels, channel } = this.props;
    const selectedSlackChannelId =
      channel.slackSettings &&
      channel.slackSettings.botConnection &&
      channel.slackSettings.botConnection.threadCreated;

    return (
      <SlackChannelRow>
        <ChannelName>{channel.name}</ChannelName>

        <SendsTo>send notifications to &rarr;</SendsTo>
        <StyledSelect>
          <Select
            onChange={this.handleSlackChannelChange}
            defaultValue={selectedSlackChannelId}
          >
            <option value={''}>{'# '}</option>
            {slackChannels.map(channel => (
              <option key={channel.id} value={channel.id}>
                # {channel.name}
              </option>
            ))}
          </Select>
        </StyledSelect>
      </SlackChannelRow>
    );
  }
}

export default compose(connect(), updateChannelSlackBotConnectionMutation)(
  ChannelSlackManager
);
