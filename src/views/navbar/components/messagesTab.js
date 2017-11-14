// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Icon from '../../../components/icons';
import {
  getUnreadDMQuery,
  MARK_SINGLE_NOTIFICATION_SEEN_MUTATION,
  markDirectMessageNotificationsSeenMutation,
} from '../../../api/notification';
import { IconLink, Label } from '../style';

type Props = {
  active: boolean,
  markDirectMessageNotificationsSeen: Function,
  data: {
    directMessageNotifications: Array<any>,
  },
};

type State = {
  count: number,
};

class MessagesTab extends React.Component<Props, State> {
  state = {
    count: 0,
  };

  setCount(props) {
    const { data: { directMessageNotifications } } = props;

    // set to 0 if no notifications exist yet
    if (
      !directMessageNotifications ||
      directMessageNotifications.length === 0
    ) {
      return this.setState({
        count: 0,
      });
    }

    // bundle dm notifications
    const obj = {};
    directMessageNotifications.map(o => {
      if (obj[o.context.id]) return;
      obj[o.context.id] = o;
    });

    // count of unique notifications determined by the thread id
    const count = Object.keys(obj).length;

    return this.setState({
      count,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const prevProps = this.props;
    const prevState = this.state;

    // once the initial query finishes loading
    if (
      !prevProps.data.directMessageNotifications &&
      nextProps.data.directMessageNotifications
    )
      return true;

    // if the user clicks on the messages tab
    if (prevProps.active !== nextProps.active) return true;

    // any time the count changes
    if (prevState.count !== nextState.count) return true;
    return false;
  }

  componentDidUpdate(prevProps) {
    const { data: prevData } = prevProps;
    const { data: thisData, active } = this.props;

    // never update the badge if the user is viewing the messages tab
    // set the count to 0 if the tab is active so that if a user loads
    // /messages view directly, the badge won't update
    if (active) {
      return this.setState({
        count: 0,
      });
    }

    if (
      !prevData.directMessageNotifications &&
      thisData.directMessageNotifications
    ) {
      return this.setCount(this.props);
    }
  }

  markAllAsSeen = () => {
    const { count } = this.state;

    // don't perform a mutation is there are no unread notifs
    if (count === 0) return;

    this.props
      .markDirectMessageNotificationsSeen()
      .then(({ data: { markAllUserDirectMessageNotificationsRead } }) => {
        // notifs were marked as seen
      })
      .catch(err => {
        // err
      });
  };

  render() {
    const { active } = this.props;
    const { count } = this.state;

    console.log(this.props);
    console.log(this.state);

    return (
      <IconLink
        data-active={active}
        to="/messages"
        rel="nofollow"
        onClick={this.markAllAsSeen}
      >
        <Icon
          glyph={count > 0 ? 'message-fill' : 'message'}
          withCount={count > 10 ? '10+' : count > 0 ? count : false}
        />

        <Label>Messages</Label>
      </IconLink>
    );
  }
}

export default compose(
  getUnreadDMQuery,
  markDirectMessageNotificationsSeenMutation
)(MessagesTab);
