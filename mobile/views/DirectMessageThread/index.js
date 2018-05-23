// @flow
import React from 'react';
import compose from 'recompose/compose';
import idx from 'idx';
import Text from '../../components/Text';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';

import {
  getCurrentUser,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';

import DirectMessageThread from './components/DirectMessageThread';
import { Wrapper } from './style';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  data: {
    user?: GetUserType,
  },
  navigation?: {
    state: {
      params: {
        id: string,
      },
    },
  },
};

class DirectMessageThreadView extends React.Component<Props> {
  render() {
    const id = idx(this.props, props => props.navigation.state.params.id);
    if (!id) return <Text>Non-existant DM thread</Text>;
    if (!this.props.data.user) return null;
    return (
      <Wrapper>
        {/* TODO(@mxstbr): We have to pass currentUser here because otherwise the sendDirectMessage mutation doesn't work. We should not make that a requirement. */}
        <DirectMessageThread currentUser={this.props.data.user} id={id} />
      </Wrapper>
    );
  }
}

export default compose(ViewNetworkHandler, getCurrentUser)(
  DirectMessageThreadView
);
