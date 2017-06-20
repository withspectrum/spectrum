//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { BillingListItem } from '../../../components/listItems';
import { IconButton } from '../../../components/buttons';
import { UpsellUpgradeToPro } from '../../../components/upsell';
import { openModal } from '../../../actions/modals';
import { convertTimestampToDate } from '../../../helpers/utils';
import { getCurrentUserRecurringPayments } from '../../../api/user';
import { displayLoadingCard } from '../../../components/loading';
import { Checkbox } from '../../../components/formElements';
import {
  StyledCard,
  LargeListHeading,
  ListHeader,
  ListContainer,
} from '../../../components/listItems/style';
import { EmailListItem, ChannelListCheckbox } from '../style';

class EmailSettings extends Component {
  handleChange = () => {};
  render() {
    return (
      <StyledCard>
        <ListHeader>
          <LargeListHeading>Email Preferences</LargeListHeading>
        </ListHeader>
        <ListContainer>
          <EmailListItem>
            <Checkbox checked={true} onChange={this.handleChange}>
              Email me when someone sends me a direct message.
            </Checkbox>
          </EmailListItem>

          <EmailListItem>
            <Checkbox checked={true} onChange={this.handleChange}>
              Email me when people respond in the threads where I'm active.
            </Checkbox>
          </EmailListItem>

          <EmailListItem>
            <Checkbox checked={true} onChange={this.handleChange}>
              Email me when new threads are published in the channels where I've
              turned on notifications.
            </Checkbox>
          </EmailListItem>
        </ListContainer>
      </StyledCard>
    );
  }
}

export default compose(
  getCurrentUserRecurringPayments,
  displayLoadingCard,
  connect()
)(EmailSettings);
