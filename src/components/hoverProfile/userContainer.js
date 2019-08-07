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
import { withCurrentUser } from 'src/components/withCurrentUser';
import LoadingHoverProfile from './loadingHoverProfile';

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
  popperNode = null;
  popperTransformStyle = null;
  span = React.createRef();
  _isMounted = false;
  state = { visible: false };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (!prevState.visible) {
      let { top, left, bottom } = this.span.current.getBoundingClientRect();
      bottom = window.innerHeight - bottom;

      return { top, left, bottom };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot === null) return;
    if (!this.popperNode || !this.popperNode.firstElementChild) return;

    const { top, left, bottom } = snapshot;
    const popover = this.popperNode.firstElementChild;

    if (bottom < popover.clientHeight) {
      this.popperTransformStyle = {
        transform: `translate3d(${left}px, ${top - popover.clientHeight}px, 0)`,
      };
    }
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

    if (this.popperNode) {
      this.popperNode = null;
    }

    if (this.popperTransformStyle) {
      this.popperTransformStyle = null;
    }

    if (this._isMounted && this.state.visible) {
      this.setState({ visible: false });
    }
  };

  render() {
    const { children, currentUser, username, style = {} } = this.props;
    const me = currentUser && currentUser.username === username;

    return (
      <Span
        ref={this.span}
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Manager tag={false}>
          <Reference>
            {({ ref }) => (
              <div ref={ref} style={style}>
                {children}
              </div>
            )}
          </Reference>
          {this.state.visible &&
            document.body &&
            createPortal(
              <Popper
                placement="bottom-start"
                innerRef={node => (this.popperNode = node)}
              >
                {({ style, ref, placement }) => (
                  <span ref={ref} data-placement={placement}>
                    <MentionHoverProfile
                      username={username}
                      me={me}
                      style={
                        this.popperTransformStyle
                          ? { ...style, ...this.popperTransformStyle }
                          : style
                      }
                    />
                  </span>
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
