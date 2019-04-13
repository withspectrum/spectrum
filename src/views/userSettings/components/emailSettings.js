// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { addToastWithTimeout } from 'src/actions/toasts';
import updateUserEmailMutation from 'shared/graphql/mutations/user/updateUserEmail';
import toggleUserNotificationSettingsMutation from 'shared/graphql/mutations/user/toggleUserNotificationSettings';
import { Checkbox } from 'src/components/formElements';
import Icon from 'src/components/icon';
import {
  ListContainer,
  Notice,
  InlineIcon,
  Description,
} from 'src/components/listItems/style';
import { EmailListItem, CheckboxContent } from '../style';
import type { GetCurrentUserSettingsType } from 'shared/graphql/queries/user/getCurrentUserSettings';
import UserEmailConfirmation from 'src/components/userEmailConfirmation';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';
import type { Dispatch } from 'redux';

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

type Props = {
  updateUserEmail: Function,
  dispatch: Dispatch<Object>,
  toggleNotificationSettings: Function,
  smallOnly: boolean,
  largeOnly: boolean,
  user: GetCurrentUserSettingsType,
};

class EmailSettings extends React.Component<Props> {
  handleChange = e => {
    let notificationType = e.target.id;
    let deliveryMethod = 'email';
    let input = {
      deliveryMethod,
      notificationType,
    };

    this.props
      .toggleNotificationSettings(input)
      .then(() => {
        return this.props.dispatch(
          addToastWithTimeout('success', 'Settings saved!')
        );
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      user: {
        settings: { notifications },
      },
      user,
    } = this.props;

    const settings = parseNotificationTypes(notifications).filter(
      notification => notification.hasOwnProperty('emailValue')
    );

    if (!user.email) {
      return (
        <SectionCard
          smallOnly={this.props.smallOnly}
          largeOnly={this.props.largeOnly}
        >
          <SectionTitle>Turn on email notifications</SectionTitle>
          <ListContainer>
            <Description>
              You can customize your email notifications to keep up to date on
              what’s important to you on Spectrum. Enter your email below and
              we’ll send you a confirmation link.
            </Description>

            <UserEmailConfirmation user={user} />
          </ListContainer>
        </SectionCard>
      );
    }

    return (
      <SectionCard
        smallOnly={this.props.smallOnly}
        largeOnly={this.props.largeOnly}
      >
        <SectionTitle>Email Preferences</SectionTitle>
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
                        <strong>Trying to mute a specific conversation?</strong>{' '}
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
                        sidebar of the individual channel’s page.
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
      </SectionCard>
    );
  }
}

export default compose(
  toggleUserNotificationSettingsMutation,
  updateUserEmailMutation,
  connect()
)(EmailSettings);
