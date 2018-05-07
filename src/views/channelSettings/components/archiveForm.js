// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modals';
import { Button } from '../../../components/buttons';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';
import { track } from 'src/helpers/events';
import * as events from 'shared/analytics/event-types';
import {
  analyticsChannel,
  analyticsCommunity,
} from 'src/helpers/events/transformations';

type Props = {
  channel: GetChannelType,
  dispatch: Function,
};

class Channel extends React.Component<Props> {
  initArchiveChannel = () => {
    const { channel } = this.props;

    const message = (
      <div>
        <p>
          Are you sure you want to archive this channel? Community members will
          no longer be able to post to this channel.
        </p>
      </div>
    );

    track(events.CHANNEL_ARCHIVED_INITED, {
      channel: analyticsChannel(channel),
      community: analyticsCommunity(channel.community),
    });

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: channel.id,
        entity: 'channel-archive',
        message,
        buttonLabel: 'Archive',
        extraProps: {
          channel,
        },
      })
    );
  };

  initRestoreChannel = () => {
    const { channel } = this.props;

    track(events.CHANNEL_RESTORED_INITED, {
      channel: analyticsChannel(channel),
      community: analyticsCommunity(channel.community),
    });

    return this.props.dispatch(
      openModal('RESTORE_CHANNEL_MODAL', {
        channel: this.props.channel,
        id: this.props.channel.community.id,
      })
    );
  };

  render() {
    const { channel } = this.props;

    if (!channel.isArchived) {
      return (
        <SectionCard>
          <SectionTitle>Archive channel</SectionTitle>
          {channel.isPrivate ? (
            <SectionSubtitle>
              Archiving a private channel will automatically remove the private
              channel item from your subscription. The channel will then become
              read-only and community members will no longer be able to start
              new conversations.
            </SectionSubtitle>
          ) : (
            <SectionSubtitle>
              Archiving a channel will make it read-only and community members
              will no longer be able to start new conversations.
            </SectionSubtitle>
          )}

          <SectionCardFooter>
            <Button onClick={this.initArchiveChannel}>Archive Channel</Button>
          </SectionCardFooter>
        </SectionCard>
      );
    } else {
      return (
        <SectionCard>
          <SectionTitle>
            Restore channel {channel.isPrivate ? '· $10/mo' : ''}
          </SectionTitle>
          {channel.isPrivate ? (
            <SectionSubtitle>
              Restoring a private channel will automatically resume your
              subscription at $10 per month. The channel will be restored and
              channel members will be able to start new conversations.
            </SectionSubtitle>
          ) : (
            <SectionSubtitle>
              The channel will be restored and channel members will be able to
              start new conversations.
            </SectionSubtitle>
          )}

          <SectionCardFooter>
            <Button onClick={this.initRestoreChannel}>Restore Channel</Button>
          </SectionCardFooter>
        </SectionCard>
      );
    }
  }
}

export default compose(connect())(Channel);
