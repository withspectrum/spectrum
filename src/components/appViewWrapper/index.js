// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter, type History } from 'react-router';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { isViewingMarketingPage } from 'src/helpers/is-viewing-marketing-page';
import { StyledAppViewWrapper } from './style';

type Props = {
  isModal: boolean,
  currentUser: ?UserInfoType,
  history: History,
  location: Object,
};

class AppViewWrapper extends React.Component<Props> {
  ref: ?HTMLElement;
  prevScrollOffset: number;

  constructor(props: Props) {
    super(props);
    this.ref = null;
    this.prevScrollOffset = 0;
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isModal: currModal } = this.props;
    const { isModal: prevModal } = prevProps;

    /*
      If the user is going to open a modal, grab the current scroll
      offset of the main view the user is on and save it for now; we'll use
      the value to restore the scroll position after the user closes the modal
    */
    if (!prevModal && currModal && this.ref) {
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
    if (snapshot !== null && this.ref) {
      this.ref.scrollTop = snapshot;
    }
  }

  render() {
    const { currentUser, history, location } = this.props;

    const isMarketingPage = isViewingMarketingPage(history, currentUser);
    const isViewingExplore = location && location.pathname === '/explore';
    const isTwoColumn = isViewingExplore || !isMarketingPage;

    return (
      <StyledAppViewWrapper
        ref={el => (this.ref = el)}
        isTwoColumn={isTwoColumn}
        {...this.props}
      />
    );
  }
}

export default compose(
  withRouter,
  withCurrentUser
)(AppViewWrapper);
