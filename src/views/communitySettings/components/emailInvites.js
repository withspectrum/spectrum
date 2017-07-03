// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { addToastWithTimeout } from '../../../actions/toasts';
import Icon from '../../../components/icons';
import { IS_EMAIL } from '../../../helpers/regexps';
import { sendEmailInvitationsMutation } from '../../../api/community';
import { displayLoadingCard } from '../../../components/loading';
import { Button } from '../../../components/buttons';
import {
  ButtonContainer,
  EmailInviteForm,
  EmailInviteInput,
  AddRow,
  RemoveRow,
} from '../style';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
} from '../../../components/listItems/style';

class EmailInvites extends Component {
  state: {
    isLoading: boolean,
    contacts: Array<any>,
  };

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
    };
  }

  uniqueEmails = array => {
    let unique = {};
    let distinct = [];
    for (let i in array) {
      if (typeof unique[array[i].email] == 'undefined') {
        distinct.push(array[i]);
      }
      unique[array[i].email] = 0;
    }
    return distinct;
  };

  sendInvitations = () => {
    const { contacts } = this.state;
    const { community, dispatch } = this.props;

    this.setState({
      isLoading: true,
    });

    let validContacts = contacts
      .filter(contact => contact.error === false)
      .filter(contact => contact.email.length > 0)
      .map(({ error, ...contact }) => {
        return { ...contact };
      });

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
        });
        dispatch(
          addToastWithTimeout(
            'success',
            `Invitations sent to ${validContacts.length > 1 ? `${validContacts.length} people` : `${validContacts.length} person`}!`
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

  render() {
    const { community } = this.props;
    const { contacts, isLoading, success } = this.state;

    return (
      <StyledCard>
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

        <ButtonContainer>
          <Button loading={isLoading} onClick={this.sendInvitations}>
            Send Invitations
          </Button>
        </ButtonContainer>
      </StyledCard>
    );
  }
}

export default compose(sendEmailInvitationsMutation, connect(), pure)(
  EmailInvites
);
