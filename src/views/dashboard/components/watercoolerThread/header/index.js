// @flow
import * as React from 'react';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import ThreadHeader from './threadHeader';

export type Props = {
  thread: GetThreadType,
  active: boolean,
};

const Header = (props: Props) => <ThreadHeader {...props} />;

export default Header;
