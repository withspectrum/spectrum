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
import {
  StyledCard,
  LargeListHeading,
  ListHeader,
  ListContainer,
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
          label: "Email me when people respond in the conversations where I'm active.",
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
