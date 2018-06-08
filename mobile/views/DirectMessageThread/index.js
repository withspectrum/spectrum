// @flow
import React from 'react';
import compose from 'recompose/compose';
import idx from 'idx';
import Text from '../../components/Text';
import { withCurrentUser } from '../../components/WithCurrentUser';
import DirectMessageThread from './components/DirectMessageThread';
import { Wrapper } from './style';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';

type Props = {
  currentUser: ?GetUserType,
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
    const { currentUser, navigation } = this.props;
    if (!id) return <Text>Non-existant DM thread</Text>;

    if (!currentUser) return null;

    return (
      <Wrapper>
        <DirectMessageThread
          navigation={navigation}
          currentUser={currentUser}
          id={id}
        />
      </Wrapper>
    );
  }
}

export default compose(withCurrentUser)(DirectMessageThreadView);
