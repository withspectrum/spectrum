// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Textarea from 'react-textarea-autosize';
import { addToastWithTimeout } from '../../../actions/toasts';
import getSlackImport from 'shared/graphql/queries/slackImport/getSlackImport';
import type { GetSlackImportType } from 'shared/graphql/queries/slackImport/getSlackImport';
import sendSlackInvitationsMutation from 'shared/graphql/mutations/slackImport/sendSlackInvitations';
import importSlackMembers from 'shared/graphql/mutations/community/importSlackMembers';
import { Loading } from '../../../components/loading';
import { Button, OutlineButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { CustomMessageToggle, CustomMessageTextAreaStyles } from '../style';
import {
  SectionCard,
  SectionCardFooter,
  SectionTitle,
} from '../../../components/settingsViews/style';
import { Description, Notice } from '../../../components/listItems/style';
import { Error } from '../../../components/formElements';
import MembersImport from './importMembers';

type Props = {
  data: {
    community: GetSlackImportType,
    startPolling: Function,
    stopPolling: Function,
  },
  hasInvitedPeople: Function,
  sendSlackInvites: Function,
  dispatch: Function,
  isLoading: boolean,
  isOnboarding: boolean,
};

type State = {
  isSendingInvites: boolean,
};

class ImportSlack extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isSendingInvites: false,
    };
  }

  sendInvites = (customMessage: string) => {
    const { community } = this.props.data;

    this.props.hasInvitedPeople && this.props.hasInvitedPeople();

    this.setState({
      isSendingInvites: true,
    });

    this.props
      .sendSlackInvites({
        id: community.id,
        customMessage,
      })
      .then(() => {
        this.setState({
          isSendingInvites: false,
        });
        this.props.dispatch(
          addToastWithTimeout('success', 'Your invitations are being sent!')
        );
        return;
      })
      .catch(err => {
        this.setState({
          isSendingInvites: false,
        });
        console.error(err);
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      data: { community, startPolling, stopPolling },
      isLoading,
    } = this.props;

    const { isSendingInvites } = this.state;

    if (community) {
      const { teamName, members, sent } = community.slackImport || {};
      const noImport = !teamName;
      const partialImport = teamName && !members;
      const fullImport = !!members;
      const invitesSent = !!sent;

      const url = this.props.isOnboarding
        ? `https://slack.com/oauth/authorize?client_id=201769987287.271382863153&scope=users:read.email%20users:read%20admin%20chat:write:bot&state=${
            community.id
          }&redirect_uri=${
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:3001/api/slack/onboarding'
              : 'https://spectrum.chat/api/slack/onboarding'
          }`
        : `https://slack.com/oauth/authorize?client_id=201769987287.271382863153&scope=users:read.email%20users:read%20admin%20chat:write:bot&state=${
            community.id
          }&redirect_uri=${
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:3001/api/slack'
              : 'https://spectrum.chat/api/slack'
          }`;

      const connected = partialImport || fullImport;
      const status =
        (partialImport && 'connected') ||
        (fullImport && 'imported') ||
        (invitesSent && 'sent') ||
        'unconnected';
      const count = members && JSON.parse(members).length;

      return (
        <div>
          <SectionTitle>
            {connected
              ? `Connected to the "${teamName}" Slack team`
              : `Slack Integration`}
          </SectionTitle>
          {connected ? (
            <MembersImport
              isSendingInvites={isSendingInvites}
              sendInvites={this.sendInvites}
              status={status}
              communityId={community.id}
              startPolling={startPolling}
              stopPolling={stopPolling}
              teamName={teamName}
              count={count || 0}
            />
          ) : (
            <React.Fragment>
              <Description>
                Easily invite your existing Slack team to Spectrum and get
                notified whenever a new thread is posted in your community.
              </Description>
              <SectionCardFooter>
                <a href={url}>
                  <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
                </a>
              </SectionCardFooter>
            </React.Fragment>
          )}
        </div>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return null;
  }
}

const ImportSlackCard = props => (
  <SectionCard>
    <ImportSlack {...props} />
  </SectionCard>
);

const ImportSlackNoCard = props => <ImportSlack {...props} />;

export const ImportSlackWithoutCard = compose(
  sendSlackInvitationsMutation,
  getSlackImport,
  connect(),
  viewNetworkHandler
)(ImportSlackNoCard);
export const ImportSlackWithCard = compose(
  sendSlackInvitationsMutation,
  getSlackImport,
  connect(),
  viewNetworkHandler
)(ImportSlackCard);
export default ImportSlackWithCard;
