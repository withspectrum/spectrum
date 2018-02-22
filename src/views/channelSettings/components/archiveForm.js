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

type Props = {
  channel: GetChannelType,
  dispatch: Function,
};

class Channel extends React.Component<Props> {
  initArchiveChannel = () => {
    const message = (
      <div>
        <p>
          Are you sure you want to archive this channel? Community members will
          no longer be able to post to this channel.
        </p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: this.props.channel.id,
        entity: 'channel-archive',
        message,
        buttonLabel: 'Archive',
      })
    );
  };

  initUnarchiveChannel = () => {
    return this.props.dispatch(
      openModal('UNARCHIVE_CHANNEL_MODAL', {
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
          <SectionTitle>Restore channel</SectionTitle>
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
            <Button onClick={this.initUnarchiveChannel}>Archive Channel</Button>
          </SectionCardFooter>
        </SectionCard>
      );
    }
  }
}

export default compose(connect())(Channel);
