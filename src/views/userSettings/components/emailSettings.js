import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  toggleNotificationSettingsMutation,
  updateUserEmailMutation,
} from '../../../api/user';
import { Checkbox, Input, Error } from '../../../components/formElements';
import Icon from '../../../components/icons';
import { Button } from '../../../components/buttons';
import isEmail from 'validator/lib/isEmail';
import {
  StyledCard,
  LargeListHeading,
  ListHeader,
  ListContainer,
  Notice,
  InlineIcon,
  Description,
} from '../../../components/listItems/style';
import { EmailListItem, CheckboxContent, EmailForm } from '../style';

const parseNotificationTypes = notifications => {
  const types = Object.keys(notifications.types).filter(
    type => type !== '__typename'
  );
  return types.map(type => {
    if (!notifications.types[type]) return {};
    switch (type) {
      case 'newMessageInThreads':
        return {
          type,
          emailValue: notifications.types[type].email,
          label:
            "Email me when people respond in the threads and private conversations where I'm active - this includes direct messages.",
          display: 'flex-start',
        };
      case 'newDirectMessage':
        return {
          type,
          emailValue: notifications.types[type].email,
          label: 'Email me when I receive new direct messages.',
          display: 'center',
        };
      case 'newThreadCreated':
        return {
          type,
          emailValue: notifications.types[type].email,
          label:
            'Email me when a new thread is published in channels where I receive notifications.',
          display: 'flex-start',
        };
      case 'dailyDigest':
        return {
          type,
          emailValue: notifications.types[type].email,
          label:
            'Email me every day with the top conversations in my communities.',
          display: 'center',
        };
      case 'weeklyDigest':
        return {
          type,
          emailValue: notifications.types[type].email,
          label:
            'Email me once every week with the top conversations in my communities',
          display: 'center',
        };
      case 'newMention':
        return {
          type,
          emailValue: notifications.types[type].email,
          label: 'Email me if someone @mentions me on Spectrum',
          display: 'flex-start',
        };
      default:
      case 'null':
        return {};
    }
  });
};

class EmailSettings extends Component {
  state: {
    email: string,
    emailError: string,
  };

  constructor() {
    super();

    this.state = {
      email: '',
      emailError: '',
    };
  }

  handleEmailChange = e => {
    this.setState({
      email: e.target.value,
      emailError: '',
    });
  };

  saveEmail = e => {
    e.preventDefault();
    const { email } = this.state;
    const { updateUserEmail } = this.props;

    if (!isEmail(email)) {
      return this.setState({
        emailError: 'Please enter a valid email address',
      });
    }

    return updateUserEmail(email)
      .then(({ data: { updateUserEmail } }) => {
        this.props.dispatch(
          addToastWithTimeout(
            'success',
            `A confirmation email has been sent to ${email}!`
          )
        );
        return this.setState({
          email: '',
        });
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  handleChange = e => {
    let notificationType = e.target.id;
    let deliveryMethod = 'email';
    let input = {
      deliveryMethod,
      notificationType,
    };

    this.props
      .toggleNotificationSettings(input)
      .then(({ data: { toggleNotificationSettings } }) => {
        this.props.dispatch(addToastWithTimeout('success', 'Settings saved!'));
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      currentUser: { settings: { notifications } },
      currentUser,
    } = this.props;
    const { emailError } = this.state;
    const settings = parseNotificationTypes(
      notifications
    ).filter(notification => notification.hasOwnProperty('emailValue'));

    if (!currentUser.email) {
      return (
        <StyledCard
          smallOnly={this.props.smallOnly}
          largeOnly={this.props.largeOnly}
        >
          <ListHeader>
            <LargeListHeading>Turn on email notifications</LargeListHeading>
          </ListHeader>
          <ListContainer>
            <Description>
              You can customize your email notifications to keep up to date on
              what's important to you on Spectrum. Enter your email below and
              we'll send you a confirmation link.
            </Description>

            {currentUser.pendingEmail && (
              <Notice>
                A confirmation link was sent to {currentUser.pendingEmail}. You
                can resend the confirmation below, or enter a new email address.
              </Notice>
            )}

            <EmailForm
              onSubmit={this.saveEmail}
              style={{ marginTop: '8px', marginBottom: '8px' }}
            >
              <Input
                type="email"
                defaultValue={null}
                onChange={this.handleEmailChange}
                placeholder={'Add your email address'}
              >
                Email Address
              </Input>

              <Button onClick={this.saveEmail}>Save</Button>
            </EmailForm>
            {emailError && <Error>{emailError}</Error>}
          </ListContainer>
        </StyledCard>
      );
    }

    return (
      <StyledCard
        smallOnly={this.props.smallOnly}
        largeOnly={this.props.largeOnly}
      >
        <ListHeader>
          <LargeListHeading>Email Preferences</LargeListHeading>
        </ListHeader>
        <ListContainer>
          {settings.map((setting, i) => {
            return (
              <EmailListItem key={i}>
                <Checkbox
                  checked={setting.emailValue}
                  onChange={this.handleChange}
                  id={setting.type}
                  align={setting.display}
                >
                  <CheckboxContent>
                    {setting.label}
                    {setting.type === 'newMessageInThreads' && (
                      <Notice>
                        <strong>
                          Trying to mute a specific conversation?
                        </strong>{' '}
                        You can turn off email notifications for individual
                        threads by clicking on the notification icon{' '}
                        <InlineIcon>
                          <Icon glyph="notification" size="16" />
                        </InlineIcon>{' '}
                        at the top of a post.
                      </Notice>
                    )}

                    {setting.type === 'newThreadCreated' && (
                      <Notice>
                        You can turn off email notifications for individual
                        channels by turning thread notifications off on in the
                        sidebar of the individual channel's page.
                      </Notice>
                    )}

                    {setting.type === 'newMention' && (
                      <Notice>
                        If you mute a specific conversation, new @mentions will
                        not send you an email.
                      </Notice>
                    )}
                  </CheckboxContent>
                </Checkbox>
              </EmailListItem>
            );
          })}
        </ListContainer>
      </StyledCard>
    );
  }
}

export default compose(
  toggleNotificationSettingsMutation,
  updateUserEmailMutation,
  connect()
)(EmailSettings);
