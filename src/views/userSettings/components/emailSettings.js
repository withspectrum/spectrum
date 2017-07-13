//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import { BillingListItem } from '../../../components/listItems';
import { IconButton } from '../../../components/buttons';
import { UpsellUpgradeToPro } from '../../../components/upsell';
import { openModal } from '../../../actions/modals';
import { convertTimestampToDate } from '../../../helpers/utils';
import {
  getCurrentUserRecurringPayments,
  toggleNotificationSettingsMutation,
} from '../../../api/user';
import { displayLoadingCard } from '../../../components/loading';
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
import { EmailListItem, ChannelListCheckbox } from '../style';

const parseNotificationTypes = notifications => {
  const types = Object.keys(notifications.types).filter(
    type => type !== '__typename'
  );
  return types.map(type => {
    switch (type) {
      case 'newMessageInThreads': {
        return {
          type,
          emailValue: notifications.types[type].email,
          label:
            'Email me when people reply to my conversations (including direct messages).',
        };
      }
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
    const settings = parseNotificationTypes(notifications);

    return (
      <StyledCard>
        <ListHeader>
          <LargeListHeading>Email Preferences</LargeListHeading>
        </ListHeader>
        <ListContainer>
          {settings.map(setting => {
            return (
              <EmailListItem>
                <Checkbox
                  checked={setting.emailValue}
                  onChange={this.handleChange}
                  id={setting.type}
                >
                  {setting.label}
                </Checkbox>
                <Notice>
                  <strong>Trying to mute a specific conversation?</strong> You
                  can turn off email notifications for individual threads by
                  clicking on the notification icon{' '}
                  <InlineIcon>
                    <Icon glyph="notification" size="16" />
                  </InlineIcon>{' '}
                  at the top of a post.
                </Notice>
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
