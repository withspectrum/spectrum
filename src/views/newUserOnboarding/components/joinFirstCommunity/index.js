// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Row } from '../discoverCommunities/style';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  dispatch: Dispatch<Object>,
  joinedFirstCommunity: Function,
  joinedCommunity: Function,
  community: {
    id: string,
    slug: string,
    coverPhoto: string,
    profilePhoto: string,
    name: string,
    description: string,
  },
};

class JoinFirstCommunityPure extends React.Component<Props> {
  render() {
    const { community, joinedCommunity } = this.props;

    return <Row style={{ alignItems: 'flex-start' }} />;
  }
}

export default compose(
  withCurrentUser,
  connect()
)(JoinFirstCommunityPure);
