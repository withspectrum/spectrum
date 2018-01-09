// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Textarea from 'react-textarea-autosize';
import { addToastWithTimeout } from '../../actions/toasts';
import Icon from '../icons';
import isEmail from 'validator/lib/isEmail';
import { sendCommunityEmailInvitationsMutation } from '../../api/community';
import { sendChannelEmailInvitationMutation } from '../../api/channel';
import { Button } from '../buttons';
import { Error } from '../formElements';
import { SectionCardFooter } from '../settingsViews/style';
import {
  EmailInviteForm,
  EmailInviteInput,
  AddRow,
  RemoveRow,
  CustomMessageToggle,
  CustomMessageTextAreaStyles,
} from './style';

type Props = {
  id: string,
  dispatch: Function,
  currentUser: Object,
  sendEmailInvites: Function,
};

type ContactProps = {
  email: string,
  firstName: string,
  lastName: string,
  error: boolean,
};

type State = {
  isLoading: boolean,
  contacts: Array<ContactProps>,
  hasCustomMessage: boolean,
  customMessageString: string,
  customMessageError: boolean,
};

class EmailInvitationForm extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      contacts: [
        {
          email: '',
          firstName: '',
          lastName: '',
          error: false,
        },
        {
          email: '',
          firstName: '',
          lastName: '',
          error: false,
        },
        {
          email: '',
          firstName: '',
          lastName: '',
          error: false,
        },
      ],
      hasCustomMessage: false,
      customMessageString: '',
      customMessageError: false,
    };
  }

  getUniqueEmails = array => array.filter((x, i, a) => a.indexOf(x) == i);

  sendInvitations = () => {
    const {
      contacts,
      hasCustomMessage,
      customMessageError,
      customMessageString,
    } = this.state;
    const { dispatch, currentUser, sendEmailInvites } = this.props;

    this.setState({ isLoading: true });

    let validContacts = contacts
      .filter(contact => contact.error === false)
      .filter(contact => contact.email !== currentUser.email)
      .filter(contact => contact.email.length > 0)
      .filter(contact => isEmail(contact.email))
      .map(({ error, ...contact }) => {
        return { ...contact };
      });

    let customMessage =
      hasCustomMessage && !customMessageError ? customMessageString : null;

    // make sure to uniqify the emails so you can't enter on email multiple times
    validContacts = this.getUniqueEmails(validContacts);

    if (validContacts.length === 0) {
      this.setState({
        isLoading: false,
      });

      return dispatch(
        addToastWithTimeout('error', 'No emails entered - try again!')
      );
    }

    sendEmailInvites({
      id: this.props.id,
      contacts: validContacts,
      customMessage,
    })
      .then(({ data: { sendEmailInvites } }) => {
        this.setState({
          isLoading: false,
          contacts: [
            {
              email: '',
              firstName: '',
              lastName: '',
              error: false,
            },
            {
              email: '',
              firstName: '',
              lastName: '',
              error: false,
            },
            {
              email: '',
              firstName: '',
              lastName: '',
              error: false,
            },
          ],
          hasCustomMessage: false,
          customMessageString: '',
          customMessageError: false,
        });

        dispatch(
          addToastWithTimeout(
            'success',
            `Invitations sent to ${validContacts.length > 1
              ? `${validContacts.length} people`
              : `${validContacts.length} person`}!`
          )
        );
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  handleChange = (e, i, key) => {
    const { contacts } = this.state;
    contacts[i][key] = e.target.value;

    this.setState({
      ...this.state,
      contacts,
    });
  };

  addRow = () => {
    const { contacts } = this.state;
    contacts.push({
      email: '',
      firstName: '',
      lastName: '',
      error: false,
    });

    this.setState({
      ...this.state,
      contacts,
    });
  };

  removeRow = index => {
    const { contacts } = this.state;
    contacts.splice(index, 1);
    this.setState({
      ...this.state,
      contacts,
    });
  };

  validate = (e, i) => {
    const { contacts } = this.state;
    if (!isEmail(e.target.value)) {
      contacts[i].error = true;
    } else {
      contacts[i].error = false;
    }

    this.setState({
      ...this.state,
      contacts,
    });
  };

  handleCustomMessageChange = e => {
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
      contacts,
      isLoading,
      hasCustomMessage,
      customMessageString,
      customMessageError,
    } = this.state;

    return (
      <div>
        {contacts.map((contact, i) => {
          return (
            <EmailInviteForm key={i}>
              <EmailInviteInput
                error={contact.error}
                type="email"
                onBlur={e => this.validate(e, i)}
                placeholder="Email address"
                value={contact.email}
                onChange={e => this.handleChange(e, i, 'email')}
              />
              <EmailInviteInput
                type="text"
                placeholder="First name (optional)"
                value={contact.firstName}
                onChange={e => this.handleChange(e, i, 'firstName')}
                hideOnMobile
              />
              <RemoveRow onClick={() => this.removeRow(i)}>
                <Icon glyph="view-close" size="16" />
              </RemoveRow>
            </EmailInviteForm>
          );
        })}

        <AddRow onClick={this.addRow}>+ Add another</AddRow>

        <CustomMessageToggle onClick={this.toggleCustomMessage}>
          <Icon glyph={hasCustomMessage ? 'view-close' : 'post'} size={20} />
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
                ? '2px solid #E3353C'
                : '2px solid #DFE7EF',
            }}
            onChange={this.handleCustomMessageChange}
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
            loading={isLoading}
            onClick={this.sendInvitations}
            disabled={hasCustomMessage && customMessageError}
          >
            Send Invitations
          </Button>
        </SectionCardFooter>
      </div>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export const CommunityInvitationForm = compose(
  // $FlowIssue
  connect(map),
  sendCommunityEmailInvitationsMutation
)(EmailInvitationForm);

export const ChannelInvitationForm = compose(
  // $FlowIssue
  connect(map),
  sendChannelEmailInvitationMutation
)(EmailInvitationForm);
