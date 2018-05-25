// @flow
import React from 'react';
import compose from 'recompose/compose';
import idx from 'idx';
import Text from '../../components/Text';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import WithCurrentUser from '../../components/WithCurrentUser';
import DirectMessageThread from './components/DirectMessageThread';
import { Wrapper } from './style';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
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
    return (
      <WithCurrentUser
        render={({ currentUser }) => {
          if (!currentUser) return null;
          return (
            <Wrapper>
              <DirectMessageThread currentUser={currentUser} id={id} />
            </Wrapper>
          );
        }}
      />
    );
  }
}

export default compose(ViewNetworkHandler)(DirectMessageThreadView);
