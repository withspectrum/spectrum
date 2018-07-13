// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo, type Client } from 'react-apollo';
import { Manager, Reference, Popper } from 'react-popper';
import { createPortal } from 'react-dom';
import UserProfile from './userProfile';
import { Span } from './style';
import {
  getUserByUsername,
  getUserByUsernameQuery,
} from 'shared/graphql/queries/user/getUser';
import LoadingHoverProfile from './loadingHoverProfile';

const MentionHoverProfile = getUserByUsername(props => {
  if (props.data.user) {
    return (
      <UserProfile
        innerRef={props.innerRef}
        user={props.data.user}
        style={props.style}
      />
    );
  }

  if (props.data.loading) {
    return (
      <LoadingHoverProfile style={props.style} innerRef={props.innerRef} />
    );
  }

  return null;
});

type Props = {
  children: any,
  username: string,
  currentUser: ?Object,
  style?: Object,
  client: Client,
};

type State = {
  visible: boolean,
  isMounted: boolean,
};

class UserHoverProfileWrapper extends React.Component<Props, State> {
  ref: ?any;
  ref = null;
  state = { visible: false, isMounted: false };

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  handleMouseEnter = () => {
    const { username, client } = this.props;

    client.query({
      query: getUserByUsernameQuery,
      variables: { username },
    });

    const ref = setTimeout(() => {
      return this.state.isMounted && this.setState({ visible: true });
    }, 500);
    this.ref = ref;
  };

  handleMouseLeave = () => {
    if (this.ref) {
      clearTimeout(this.ref);
    }

    if (this.state.isMounted && this.state.visible) {
      this.setState({ visible: false });
    }
  };

  render() {
    const { children, currentUser, username, style = {} } = this.props;
    const me = currentUser && currentUser.username === username;
    return (
      <Span
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={style}
      >
        <Manager>
          <Reference>
            {({ ref }) => (
              <Span innerRef={ref} style={style}>
                {children}
              </Span>
            )}
          </Reference>
          {this.state.visible &&
            document.body &&
            createPortal(
              <Popper
                placement="top-start"
                modifiers={{
                  preventOverflow: { enabled: false },
                  hide: { enabled: false },
                }}
              >
                {({ style, ref }) => (
                  <MentionHoverProfile
                    username={username}
                    me={me}
                    innerRef={ref}
                    style={style}
                  />
                )}
              </Popper>,
              document.body
            )}
        </Manager>
      </Span>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowFixMe
  connect(map),
  withApollo
)(UserHoverProfileWrapper);
