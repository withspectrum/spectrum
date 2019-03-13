// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { StyledAppViewWrapper } from './style';

class AppViewWrapper extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.ref = null;
    this.prevScrollOffset = 0;
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { hasModal: currModal } = this.props;
    const { hasModal: prevModal } = prevProps;

    /*
      If the user is going to open a modal, grab the current scroll
      offset of the main view the user is on and save it for now; we'll use
      the value to restore the scroll position after the user closes the modal
    */
    if (!prevModal && currModal) {
      const offset = this.ref.scrollTop;
      this.prevScrollOffset = offset;
      return null;
    }

    if (prevModal && !currModal) {
      // the user is closing the modal, return the previous view's scroll offset
      return this.prevScrollOffset;
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    /*
      If we have a snapshot value, the user has closed a modal and we need
      to return the user to where they were previously scrolled in the primary
      view
    */
    if (snapshot !== null) {
      this.ref.scrollTop = snapshot;
    }
  }

  render() {
    const { currentUser } = this.props;
    const isSignedIn = currentUser && currentUser.id;

    return (
      <StyledAppViewWrapper
        ref={el => (this.ref = el)}
        isSignedIn={isSignedIn}
        // Note(@mxstbr): This ID is needed to make infinite scrolling work
        // DO NOT REMOVE IT
        id={'app-scroll-boundary'}
        {...this.props}
      />
    );
  }
}

export default compose(
  withRouter,
  withCurrentUser
)(AppViewWrapper);
