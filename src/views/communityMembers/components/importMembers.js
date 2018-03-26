// @flow
import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Description } from '../../../components/listItems/style';
import { Error } from '../../../components/formElements';
import { SectionCardFooter } from '../../../components/settingsViews/style';
import { CustomMessageToggle, CustomMessageTextAreaStyles } from '../style';
import { Button, OutlineButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import importSlackMembersMutation from 'shared/graphql/mutations/community/importSlackMembers';
import { addToastWithTimeout } from '../../../actions/toasts';

type MembersImportProps = {
  status: 'unconnected' | 'connected' | 'imported' | 'sent',
  sendInvites: (customMessage: string) => void,
  isSendingInvites: boolean,
  importSlackMembers: ({ id: string }) => Promise<any>,
  communityId: string,
  startPolling: Function,
  stopPolling: Function,
  dispatch: Function,
  teamName?: string,
  count?: number,
};

type MembersImportState = {
  hasCustomMessage: boolean,
  customMessage: string,
  isImportingMembers: boolean,
};

class MembersImport extends React.Component<
  MembersImportProps,
  MembersImportState
> {
  state = {
    hasCustomMessage: false,
    customMessage: '',
    isImportingMembers: false,
  };

  changeCustomMessage = (evt: SyntheticInputEvent<>) => {
    this.setState({
      customMessage: evt.target.value,
    });
  };

  toggleCustomMessage = () => {
    this.setState(prev => ({
      hasCustomMessage: !prev.hasCustomMessage,
    }));
  };

  sendInvites = () => {
    const { customMessage } = this.state;
    const { sendInvites } = this.props;
    if (customMessage.length > 500) return;
    return sendInvites(customMessage);
  };

  importMembers = () => {
    const { startPolling, communityId } = this.props;
    this.setState({
      isImportingMembers: true,
    });
    this.props
      .importSlackMembers({ id: communityId })
      .then(result => {
        if (result.data.importSlackMembers) {
          startPolling(1000);
        } else {
          this.props.dispatch(
            addToastWithTimeout(
              'error',
              'Something went wrong while trying to import your members.'
            )
          );
          this.setState({
            isImportingMembers: false,
          });
        }
      })
      .catch(err => {
        console.error(err);
        this.props.dispatch(
          addToastWithTimeout(
            'error',
            'Something went wrong while trying to import your members.'
          )
        );
        this.setState({
          isImportingMembers: false,
        });
      });
  };

  componentWillReceiveProps(next: MembersImportProps) {
    const curr = this.props;
    // If the status changes, stop polling.
    // NOTE(@mxstbr): This could probably be more granular
    if (next.status !== curr.status) {
      this.setState({
        isImportingMembers: false,
      });
      next.stopPolling();
    }
  }

  render() {
    const { hasCustomMessage, customMessage, isImportingMembers } = this.state;
    const { status, count, isSendingInvites } = this.props;
    const customMessageError = customMessage.length > 500;

    // Connected, but nothing imported or sent yet
    if (status === 'connected') {
      return (
        <React.Fragment>
          <Description>
            Import your team members to invite them to Spectrum.
          </Description>
          <SectionCardFooter>
            <Button
              gradientTheme="success"
              onClick={this.importMembers}
              loading={isImportingMembers}
            >
              Import members from Slack
            </Button>
          </SectionCardFooter>
        </React.Fragment>
      );
    }

    // Imported, but not sent yet
    if (status === 'imported') {
      return (
        <React.Fragment>
          <Description>
            We found {count} members with email addresses - you can invite them
            to your Spectrum community in one click.
          </Description>

          <CustomMessageToggle onClick={this.toggleCustomMessage}>
            <Icon glyph={hasCustomMessage ? 'view-close' : 'post'} size={20} />
            {hasCustomMessage
              ? 'Remove custom message'
              : 'Optional: Add a custom message to your invitation'}
          </CustomMessageToggle>

          {hasCustomMessage && (
            <Textarea
              autoFocus
              value={customMessage}
              placeholder="Write something sweet here..."
              style={{
                ...CustomMessageTextAreaStyles,
                border: customMessageError
                  ? '1px solid #E3353C'
                  : '1px solid #DFE7EF',
              }}
              onChange={this.changeCustomMessage}
            />
          )}

          {hasCustomMessage &&
            customMessageError && (
              <Error>
                Your custom invitation message can be up to 500 characters.
              </Error>
            )}

          <SectionCardFooter>
            <OutlineButton
              onClick={this.importMembers}
              loading={isImportingMembers}
            >
              Import team members anew
            </OutlineButton>
            <Button
              gradientTheme="success"
              onClick={this.sendInvites}
              loading={isSendingInvites}
              disabled={hasCustomMessage && customMessageError}
            >
              Invite {count} people to Spectrum
            </Button>
          </SectionCardFooter>
        </React.Fragment>
      );
    }

    // Sent
    if (status === 'sent') {
      return (
        <React.Fragment>
          <Description>
            We found {count} members with email addresses - you have already
            invited them to join your community.
          </Description>
        </React.Fragment>
      );
    }

    // Unconnected/fallback
    return null;
  }
}

export default compose(importSlackMembersMutation, connect())(MembersImport);
