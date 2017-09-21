//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import { toggleNotificationSettingsMutation } from '../../../api/user';
import { Checkbox } from '../../../components/formElements';
import Icon from '../../../components/icons';
import {
  StyledCard,
  LargeListHeading,
  ListHeader,
  ListContainer,
  Notice,
  InlineIcon,
} from '../../../components/listItems/style';
import { EmailListItem, CheckboxContent } from '../style';

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
      default:
      case 'null':
        return {};
    }
  });
};

class EmailSettings extends Component {
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
    const { currentUser: { settings: { notifications } } } = this.props;
    const settings = parseNotificationTypes(
      notifications
    ).filter(notification => notification.hasOwnProperty('emailValue'));

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

export default compose(toggleNotificationSettingsMutation, connect())(
  EmailSettings
);
