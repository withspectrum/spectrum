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
            "Email me when people respond in the threads and private conversations where I'm active - this includes direct messages.",
        };
      }
    }
  });
};

class NotificationSettings extends Component {
  render() {
    return (
      <StyledCard>
        <ListHeader>
          <LargeListHeading>Notification Preferences</LargeListHeading>
        </ListHeader>
        <ListContainer>
          <EmailListItem>
            <Checkbox>Enable browser push notifications</Checkbox>
          </EmailListItem>
        </ListContainer>
      </StyledCard>
    );
  }
}

export default connect()(NotificationSettings);
