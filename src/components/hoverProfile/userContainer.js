// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo, type Client } from 'react-apollo';
import { Manager, Reference, Popper } from 'react-popper';
import { createPortal } from 'react-dom';
import { withCurrentUser } from 'src/components/withCurrentUser';
import LoadingHoverProfile from './loadingHoverProfile';
import UserProfile from './userProfile';
import { Span, PopperWrapper } from './style';
import {
  getUserByUsername,
  getUserByUsernameQuery,
} from 'shared/graphql/queries/user/getUser';

const MentionHoverProfile = getUserByUsername(props => {
  if (props.data && props.data.user) {
    return (
      <UserProfile ref={props.ref} user={props.data.user} style={props.style} />
    );
  }

  if (props.data && props.data.loading) {
    return <LoadingHoverProfile style={props.style} ref={props.ref} />;
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
};

class UserHoverProfileWrapper extends React.Component<Props, State> {
  ref: ?any;
  ref = null;
  state = { visible: false };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleMouseEnter = () => {
    const { username, client } = this.props;

    if (!this._isMounted) return;

    client
      .query({
        query: getUserByUsernameQuery,
        variables: { username },
      })
      .then(() => {
        if (!this._isMounted) return;
      });

    const ref = setTimeout(() => {
      if (this._isMounted) {
        return this.setState({ visible: true });
      }
    }, 500);
    this.ref = ref;
  };

  handleMouseLeave = () => {
    if (this.ref) {
      clearTimeout(this.ref);
    }

    if (this._isMounted && this.state.visible) {
      this.setState({ visible: false });
    }
  };

  render() {
    const { children, currentUser, username, style = {} } = this.props;
    const { visible } = this.state;
    const me = currentUser && currentUser.username === username;

    return (
      <Span
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={style}
      >
        <Manager tag={false}>
          <Reference>
            {({ ref }) => (
              <div ref={ref} style={style}>
                {children}
              </div>
            )}
          </Reference>
          {visible &&
            document.body &&
            createPortal(
              <Popper
                placement="bottom-start"
                modifiers={{
                  flip: {
                    enabled: true,
                  },
                  preventOverflow: {
                    enabled: true,
                    padding: 25,
                  },
                }}
              >
                {({ style, ref, placement }) => (
                  <PopperWrapper
                    ref={ref}
                    popperStyle={style}
                    data-placement={placement}
                  >
                    <MentionHoverProfile username={username} me={me} />
                  </PopperWrapper>
                )}
              </Popper>,
              document.body
            )}
        </Manager>
      </Span>
    );
  }
}

export default compose(
  withCurrentUser,
  withApollo,
  connect()
)(UserHoverProfileWrapper);
