// @flow
import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Textarea from 'react-textarea-autosize';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  getSlackImport,
  sendSlackInvitationsMutation,
} from '../../../api/slackImport';
import { Loading } from '../../../components/loading';
import { Button } from '../../../components/buttons';
import Icon from '../../../components/icons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import {
  CustomMessageToggle,
  CustomMessageTextAreaStyles,
  SectionCard,
  SectionCardFooter,
  SectionTitle,
} from '../style';
import { Description, Notice } from '../../../components/listItems/style';
import { Error } from '../../../components/formElements';

type Props = {
  data: {
    community: Object,
    startPolling: Function,
    stopPolling: Function,
  },
  hasInvitedPeople: Function,
  sendSlackInvites: Function,
  dispatch: Function,
  isLoading: boolean,
};

type State = {
  isSendingInvites: boolean,
  hasCustomMessage: boolean,
  customMessageString: string,
  customMessageError: boolean,
};

class ImportSlack extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isSendingInvites: false,
      hasCustomMessage: false,
      customMessageString: '',
      customMessageError: false,
    };
  }

  sendInvites = () => {
    const { community } = this.props.data;
    const {
      customMessageError,
      customMessageString,
      hasCustomMessage,
    } = this.state;

    this.props.hasInvitedPeople && this.props.hasInvitedPeople();

    let customMessage =
      hasCustomMessage && !customMessageError ? customMessageString : null;

    this.setState({
      isSendingInvites: true,
    });

    this.props
      .sendSlackInvites({
        id: community.id,
        customMessage,
      })
      .then(({ data: { sendSlackInvites } }) => {
        this.setState({
          isSendingInvites: false,
          hasCustomMessage: false,
        });
        this.props.dispatch(
          addToastWithTimeout('success', 'Your invitations are being sent!')
        );
      })
      .catch(err => {
        this.setState({
          isSendingInvites: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  handleChange = e => {
    const customMessageString = e.target.value;
    if (customMessageString.length > 500) {
      this.setState({
        customMessageString,
        customMessageError: true,
      });
    } else {
      this.setState({
        customMessageString,
        customMessageError: false,
      });
    }
  };

  toggleCustomMessage = () => {
    const { hasCustomMessage } = this.state;
    this.setState({
      hasCustomMessage: !hasCustomMessage,
    });
  };

  render() {
    const {
      data: { community, startPolling, stopPolling },
      isLoading,
    } = this.props;
    const {
      isSendingInvites,
      customMessageString,
      hasCustomMessage,
      customMessageError,
    } = this.state;

    if (community) {
      // if no import has been created yet, we won't have a team name or a record at all
      const noImport =
        !community.slackImport || !community.slackImport.teamName;
      // if an import has been created, but does not have members data yet
      const partialImport =
        community.slackImport &&
        community.slackImport.teamName &&
        !community.slackImport.members;
      // if an import has been created and we have members
      const fullImport = community.slackImport && community.slackImport.members;
      const hasAlreadyBeenSent = fullImport && community.slackImport.sent;

      const url = this.props.isOnboarding
        ? `https://slack.com/oauth/authorize?&client_id=201769987287.200380534417&scope=users:read.email,users:read,team:read,admin&state=${community.id}&redirect_uri=${process
            .env.NODE_ENV === 'development'
            ? 'http://localhost:3001/api/slack/onboarding'
            : 'https://spectrum.chat/api/slack/onboarding'}`
        : `https://slack.com/oauth/authorize?&client_id=201769987287.200380534417&scope=users:read.email,users:read,team:read,admin&state=${community.id}&redirect_uri=${process
            .env.NODE_ENV === 'development'
            ? 'http://localhost:3001/api/slack'
            : 'https://spectrum.chat/api/slack'}`;

      if (noImport) {
        return (
          <div>
            <SectionTitle>Invite a Slack Team</SectionTitle>
            <Description>
              Easily invite your team from an existing Slack team to Spectrum.
              Get started by connecting your team below.{' '}
            </Description>
            <Notice>
              <strong>Note:</strong> We will not invite any of your team members
              until you’re ready. We will prompt for admin access to ensure that
              you own the Slack team.
            </Notice>
            <SectionCardFooter>
              <a href={url}>
                <Button>Connect a Slack Team</Button>
              </a>
            </SectionCardFooter>
          </div>
        );
      } else if (partialImport) {
        startPolling(5000);
        return (
          <div>
            <SectionTitle>Invite a Slack Team</SectionTitle>
            <SectionCardFooter>
              <Button loading>Connecting with Slack...</Button>
            </SectionCardFooter>
          </div>
        );
      } else if (fullImport) {
        stopPolling();
        const members = JSON.parse(community.slackImport.members);
        const teamName = community.slackImport.teamName;
        const count = members.length.toLocaleString();

        if (hasAlreadyBeenSent) {
          return (
            <div>
              <SectionTitle>Invite your Slack team</SectionTitle>
              <Description>
                This community has been connected to the{' '}
                <strong>{teamName}</strong> Slack team. We found {count} members
                with email addresses - you have already invited them to join
                your community.
              </Description>
              <SectionCardFooter>
                <Button disabled>Invites sent to {count} people</Button>
              </SectionCardFooter>
            </div>
          );
        } else {
          return (
            <div>
              <SectionTitle>Invite a Slack Team</SectionTitle>
              <Description>
                This community has been connected to the{' '}
                <strong>{teamName}</strong> Slack team. We found {count} members
                with email addresses - you can invite them to your Spectrum
                community in one click.
              </Description>

              <CustomMessageToggle onClick={this.toggleCustomMessage}>
                <Icon
                  glyph={hasCustomMessage ? 'view-close' : 'post'}
                  size={20}
                />
                {hasCustomMessage
                  ? 'Remove custom message'
                  : 'Optional: Add a custom message to your invitation'}
              </CustomMessageToggle>

              {hasCustomMessage && (
                <Textarea
                  autoFocus
                  value={customMessageString}
                  placeholder="Write something sweet here..."
                  style={{
                    ...CustomMessageTextAreaStyles,
                    border: customMessageError
                      ? '1px solid #E3353C'
                      : '1px solid #DFE7EF',
                  }}
                  onChange={this.handleChange}
                />
              )}

              {hasCustomMessage &&
                customMessageError && (
                  <Error>
                    Your custom invitation message can be up to 500 characters.
                  </Error>
                )}

              <SectionCardFooter>
                <Button
                  gradientTheme="success"
                  onClick={this.sendInvites}
                  loading={isSendingInvites}
                  disabled={hasCustomMessage && customMessageError}
                >
                  Invite {count} people to Spectrum
                </Button>
              </SectionCardFooter>
            </div>
          );
        }
      }
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
