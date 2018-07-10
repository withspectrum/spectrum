// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Manager, Reference, Popper } from 'react-popper';
import { createPortal } from 'react-dom';
import UserProfile from './userProfile';
import { Span } from './style';
import { getUserByUsername } from 'shared/graphql/queries/user/getUser';
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
};

type State = {
  visible: boolean,
};

class UserHoverProfileWrapper extends React.Component<Props, State> {
  ref: ?any;
  ref = null;
  state = { visible: false };

  handleMouseEnter = () => {
    const ref = setTimeout(() => {
      this.setState({ visible: true });
    }, 500);
    this.ref = ref;
  };

  handleMouseLeave = () => {
    if (this.ref) {
      clearTimeout(this.ref);
    }

    if (this.state.visible) {
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
// $FlowFixMe
export default connect(map)(UserHoverProfileWrapper);
