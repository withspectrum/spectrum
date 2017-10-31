// @flow
import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import { toggleChannelNotificationsMutation } from '../../../api/channel';
import { Checkbox } from '../../../components/formElements';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  StyledCard,
  ListHeader,
  ListHeading,
  ListContainer,
} from '../../../components/listItems/style';

type Props = {
  value: boolean,
  channel: {
    id: string,
    name: string,
  },
  toggleChannelNotifications: Function,
  dispatch: Function,
};

type State = {
  isReceiving: boolean,
};

class NotificationsTogglePure extends React.Component<Props, State> {
  state: {
    isReceiving: boolean,
  };

  constructor(props) {
    super(props);

    const isReceiving = props.value;
    this.state = {
      isReceiving,
    };
  }

  handleChange = () => {
    const { channel: { id } } = this.props;
    const { isReceiving } = this.state;
    this.setState({
      isReceiving: !isReceiving,
    });

    this.props
      .toggleChannelNotifications(id)
      .then(({ data: { toggleChannelNotifications } }) => {
        const value =
          toggleChannelNotifications.channelPermissions.receiveNotifications;
        const type = value ? 'success' : 'neutral';
        const str = value
          ? 'Notifications activated!'
          : 'Notifications turned off.';
        this.props.dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isReceiving } = this.state;
    const { channel } = this.props;

    return (
      <StyledCard largeOnly>
        <ListHeader>
          <ListHeading>New Thread Notifications</ListHeading>
        </ListHeader>
        <ListContainer>
          <Checkbox
            id="isPrivate"
            checked={isReceiving}
            onChange={this.handleChange}
          >
            Get notified when new threads are published in {channel.name}
          </Checkbox>
        </ListContainer>
      </StyledCard>
    );
  }
}

export const NotificationsToggle = compose(
  toggleChannelNotificationsMutation,
  connect()
)(NotificationsTogglePure);
export default NotificationsToggle;
