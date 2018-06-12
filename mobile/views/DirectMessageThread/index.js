// @flow
import React from 'react';
import compose from 'recompose/compose';
import Text from '../../components/Text';
import { withCurrentUser } from '../../components/WithCurrentUser';
import DirectMessageThread from './components/DirectMessageThread';
import { Wrapper } from './style';
import ErrorBoundary from '../../components/ErrorBoundary';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import type { NavigationProps } from 'react-navigation';

type Props = {
  currentUser: ?GetUserType,
  navigation: NavigationProps,
};

class DirectMessageThreadView extends React.Component<Props> {
  render() {
    const { currentUser, navigation } = this.props;
    const id = navigation.getParam('id', null);
    if (!id) return <Text>Non-existant DM thread</Text>;

    if (!currentUser) return null;

    return (
      <Wrapper>
        <ErrorBoundary alert>
          <DirectMessageThread
            navigation={navigation}
            currentUser={currentUser}
            id={id}
          />
        </ErrorBoundary>
      </Wrapper>
    );
  }
}

export default compose(withCurrentUser)(DirectMessageThreadView);
