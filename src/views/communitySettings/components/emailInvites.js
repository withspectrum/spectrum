// @flow
import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Textarea from 'react-textarea-autosize';
import { addToastWithTimeout } from '../../../actions/toasts';
import Icon from '../../../components/icons';
import { IS_EMAIL } from '../../../helpers/regexps';
import { sendEmailInvitationsMutation } from '../../../api/community';
import { Button } from '../../../components/buttons';
import { Error } from '../../../components/formElements';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import {
  ButtonContainer,
  EmailInviteForm,
  EmailInviteInput,
  AddRow,
  RemoveRow,
  CustomMessageToggle,
  CustomMessageTextAreaStyles,
} from '../style';
import {
  StyledCard,
  LargeListHeading,
  Description,
} from '../../../components/listItems/style';

type Props = {
  community: Object,
  dispatch: Function,
  currentUser: Object,
  hasInvitedPeople?: Function,
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

class EmailInvites extends React.Component<Props, State> {
  constructor() {
    super();

    // seed the default state with 3 empty email contacts
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

  uniqueEmails = array => {
    let unique = {};
    let distinct = [];
    for (let i in array) {
      if (typeof unique[array[i].email] === 'undefined') {
        distinct.push(array[i]);
      }
      unique[array[i].email] = 0;
    }

    return distinct;
  };

  sendInvitations = () => {
    const {
      contacts,
      hasCustomMessage,
      customMessageError,
      customMessageString,
    } = this.state;
    const { community, dispatch, currentUser, hasInvitedPeople } = this.props;
    hasInvitedPeople && hasInvitedPeople();

    this.setState({
      isLoading: true,
    });

    let validContacts = contacts
      .filter(contact => contact.error === false)
      .filter(contact => contact.email.length > 0)
      .filter(contact => contact.email !== currentUser.email)
      .map(({ error, ...contact }) => {
        return { ...contact };
      });

    let customMessage =
      hasCustomMessage && !customMessageError ? customMessageString : null;

    // make sure to uniqify the emails so you can't enter on email multiple times
    validContacts = this.uniqueEmails(validContacts);

    if (validContacts.length === 0) {
      this.setState({
        isLoading: false,
      });

      return dispatch(
        addToastWithTimeout('error', 'No emails entered - try again!')
      );
    }

    this.props
      .sendEmailInvites({
        id: community.id,
        contacts: validContacts,
        customMessage,
      })
      .then(({ data: { sendEmailInvites } }) => {
        this.setState({
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
          isLoading: false,
          hasCustomMessage: false,
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
    });

    this.setState({
      ...this.state,
      contacts,
    });
  };

  removeRow = i => {
    const { contacts } = this.state;
    contacts.splice(i, 1);
    this.setState({
      ...this.state,
      contacts,
    });
  };

  validate = (e, i) => {
    const { contacts } = this.state;
    if (!e.target.value.match(IS_EMAIL)) {
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
      <div style={{ width: '100%' }}>
        <LargeListHeading>Invite by Email</LargeListHeading>
        <Description>
          Invite people to your community directly by email.
        </Description>
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
          {hasCustomMessage ? (
            'Remove custom message'
          ) : (
            'Optional: Add a custom message to your invitation'
          )}
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

        <ButtonContainer>
          <Button
            loading={isLoading}
            onClick={this.sendInvitations}
            disabled={hasCustomMessage && customMessageError}
          >
            Send Invitations
          </Button>
        </ButtonContainer>
      </div>
    );
  }
}

const EmailInvitesCard = props => (
  <StyledCard>
    <EmailInvites {...props} />
  </StyledCard>
);

const EmailInvitesNoCard = props => <EmailInvites {...props} />;

const map = state => ({
  currentUser: state.users.currentUser,
});

export const EmailInvitesWithoutCard = compose(
  sendEmailInvitationsMutation,
  connect(map),
  viewNetworkHandler,
  pure
)(EmailInvitesNoCard);
export const EmailInvitesWithCard = compose(
  sendEmailInvitationsMutation,
  connect(map),
  viewNetworkHandler,
  pure
)(EmailInvitesCard);
export default EmailInvitesWithCard;
