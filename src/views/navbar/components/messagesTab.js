// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Icon from '../../../components/icons';
import Head from '../../../components/head';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import {
  getUnreadDMQuery,
  markDirectMessageNotificationsSeenMutation,
} from '../../../api/notification';
import { IconLink, Label } from '../style';

type Props = {
  active: boolean,
  isLoading: boolean,
  hasError: boolean,
  isRefetching: boolean,
  markDirectMessageNotificationsSeen: Function,
  data: {
    directMessageNotifications?: Array<any>,
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

  shouldComponentUpdate(nextProps, nextState) {
    const prevProps = this.props;
    const prevState = this.state;

    // if a refetch completes
    if (prevProps.isRefetching !== nextProps.isRefetching) return true;

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
      nextProps.data.directMessageNotifications &&
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
      // if the user is viewing /messages, mark any incoming notifications
      // as seen, so that when they navigate away the message count won't shoot up
      this.markAllAsSeen();
      return this.setState({
        count: 0,
      });
    }

    // if the component updates for the first time
    if (
      !prevData.directMessageNotifications &&
      thisData.directMessageNotifications
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

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe = () => {
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
      return;
    });

    // count of unique notifications determined by the thread id
    const count = Object.keys(obj).length;

    return this.setState({
      count,
    });
  }

  markAllAsSeen = () => {
    const {
      data: { directMessageNotifications },
      markDirectMessageNotificationsSeen,
      refetch,
    } = this.props;

    // if there are no unread, escape
    if (directMessageNotifications && directMessageNotifications.length === 0)
      return;

    // otherwise
    return markDirectMessageNotificationsSeen()
      .then(() => {
        // notifs were marked as seen
        // refetch to make sure we're keeping up with the server's state
        return refetch();
      })
      .catch(err => {
        // err
      });
  };

  render() {
    const { active } = this.props;
    const { count } = this.state;

    return (
      <IconLink
        data-active={active}
        to="/messages"
        rel="nofollow"
        onClick={this.markAllAsSeen}
      >
        <Head>
          {count > 0 ? (
            <link
              rel="shortcut icon"
              id="dynamic-favicon"
              // $FlowIssue
              href={`${process.env.PUBLIC_URL}/img/favicon_unread.ico`}
            />
          ) : (
            <link
              rel="shortcut icon"
              id="dynamic-favicon"
              // $FlowIssue
              href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
            />
          )}
        </Head>

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
  markDirectMessageNotificationsSeenMutation,
  viewNetworkHandler
)(MessagesTab);
