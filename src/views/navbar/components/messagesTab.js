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
  subscribeToDMs: Function,
  refetch: Function,
};

type State = {
  count: number,
  subscription: ?Function,
};

class MessagesTab extends React.Component<Props, State> {
  state = {
    count: 0,
    subscription: null,
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
    directMessageNotifications.filter(n => !n.isSeen).map(o => {
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
    console.log('scu nextprops', nextProps);
    const prevProps = this.props;
    const prevState = this.state;

    // if a refetch completes
    if (
      prevProps.data.networkStatus === 4 &&
      nextProps.data.networkStatus === 7
    )
      return true;

    // once the initial query finishes loading
    if (
      !prevProps.data.directMessageNotifications &&
      nextProps.data.directMessageNotifications
    )
      return true;

    // if a subscription updates the number of records returned
    if (
      prevProps.data &&
      prevProps.data.directMessageNotifications &&
      prevProps.data.directMessageNotifications.length !==
        nextProps.data.directMessageNotifications.length
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
    const { subscription } = this.state;

    // never update the badge if the user is viewing the messages tab
    // set the count to 0 if the tab is active so that if a user loads
    // /messages view directly, the badge won't update
    if (active) {
      return this.setState({
        count: 0,
      });
    }

    // if you load /messages directly, then navigate away, start
    // a subscription
    if (prevProps.active && !active && !subscription) {
      return this.subscribe();
    }

    // if the component updates for the first time
    if (
      !prevData.directMessageNotifications &&
      thisData.directMessageNotifications &&
      !subscription
    ) {
      this.subscribe();
      return this.setCount(this.props);
    }

    // if the component updates with changed or new dm notifications
    // if any are unseen, set the counts
    if (
      thisData.directMessageNotifications &&
      thisData.directMessageNotifications.length > 0 &&
      thisData.directMessageNotifications.some(n => !n.isSeen)
    ) {
      return this.setCount(this.props);
    }
  }

  markAllAsSeen = () => {
    const { count } = this.state;

    // don't perform a mutation is there are no unread notifs
    if (count === 0) return;

    // otherwise
    this.props
      .markDirectMessageNotificationsSeen()
      .then(({ data: { markAllUserDirectMessageNotificationsRead } }) => {
        // notifs were marked as seen
        this.props.refetch();
      })
      .catch(err => {
        // err
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe = () => {
    console.log('SUBSCRIBED TO NEW DMs');
    this.setState({
      subscription: this.props.subscribeToDMs(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  render() {
    const { active } = this.props;
    const { count } = this.state;

    console.log('PROPS: ', this.props);
    console.log('STATE: ', this.state);

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
