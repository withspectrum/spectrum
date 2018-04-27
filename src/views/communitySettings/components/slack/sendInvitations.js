// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { GetSlackSettingsType } from 'shared/graphql/queries/community/getCommunitySlackSettings';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { Button } from 'src/components/buttons';
import { TextArea, Error } from 'src/components/formElements';
import sendSlackInvitesMutation from 'shared/graphql/mutations/community/sendSlackInvites';
import { addToastWithTimeout } from 'src/actions/toasts';

type Props = {
  community: GetSlackSettingsType,
  sendSlackInvites: Function,
  dispatch: Function,
};
type State = { customMessage: ?string, isLoading: boolean };

class SendSlackInvitations extends React.Component<Props, State> {
  state = { customMessage: null, isLoading: false };

  updateCustomMessage = (evt: SyntheticInputEvent<>) => {
    this.setState({
      customMessage: evt.target.value,
    });
  };

  sendInvitations = () => {
    const { community, sendSlackInvites } = this.props;
    const { customMessage } = this.state;

    this.setState({
      isLoading: true,
    });

    return sendSlackInvites({
      id: community.id,
      customMessage,
    })
      .then(result => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(
          addToastWithTimeout('success', 'Your invitations are being sent!')
        );
        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { community } = this.props;
    const { customMessage, isLoading } = this.state;
    const customMessageError = customMessage && customMessage.length > 500;

    if (community.slackSettings.hasSentInvites) {
      return (
        <SectionCard>
          <SectionTitle>Invite your team</SectionTitle>
          <SectionSubtitle />

          <SectionCardFooter>
            <Button disabled>Invites sent!</Button>
          </SectionCardFooter>
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <SectionTitle>
          Invite the {community.slackSettings.teamName} Slack team
        </SectionTitle>
        <SectionSubtitle>
          Your Slack team has been connected! Invite your Slack team to your
          community.
        </SectionSubtitle>

        <TextArea
          defaultValue={customMessage}
          onChange={this.updateCustomMessage}
          placeholder={'Add an optional custom message to your invitations'}
        >
          Add an optional custom message
        </TextArea>

        {customMessageError && (
          <Error>
            Your custom invitation message can be up to 500 characters.
          </Error>
        )}

        <SectionCardFooter>
          <Button
            onClick={this.sendInvitations}
            loading={isLoading}
            disabled={customMessageError}
          >
            Send invitations
          </Button>
        </SectionCardFooter>
      </SectionCard>
    );
  }
}

export default compose(connect(), sendSlackInvitesMutation)(
  SendSlackInvitations
);
