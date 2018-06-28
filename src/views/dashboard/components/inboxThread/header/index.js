// @flow
import * as React from 'react';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import ThreadHeader from './threadHeader';
import UserProfileThreadHeader from './userProfileThreadHeader';

export type HeaderProps = {
  thread: GetThreadType,
  active: boolean,
  currentUser: ?Object,
  viewContext?:
    | ?'communityInbox'
    | 'communityProfile'
    | 'channelInbox'
    | 'channelProfile'
    | 'userProfile',
};

class Header extends React.Component<HeaderProps> {
  render() {
    if (this.props.viewContext === 'userProfile') {
      return <UserProfileThreadHeader {...this.props} />;
    }

    return <ThreadHeader {...this.props} />;
  }
}

export default Header;
