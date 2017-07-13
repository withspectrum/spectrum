//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
import { Checkbox } from '../../../components/formElements';
import {
  StyledCard,
  LargeListHeading,
  ListHeader,
  ListContainer,
} from '../../../components/listItems/style';
import { EmailListItem } from '../style';

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
