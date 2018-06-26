// @flow
import * as React from 'react';
import type { NavigationProps } from 'react-navigation';
import { Query } from 'react-apollo';
import Composer from './Composer';
import DirectMessageThread from '../DirectMessageThread';
import Loading from '../../components/Loading';
import { getDirectMessageThreadByUserIdQuery } from '../../../shared/graphql/queries/directMessageThread/getDirectMessageThreadByUserId';

type Props = {
  navigation: NavigationProps,
};

class DirectMessageComposerContainer extends React.Component<Props> {
  render() {
    const { navigation } = this.props;

    if (!navigation.state.params || !navigation.state.params.presetUserId) {
      return <Composer {...this.props} />;
    }

    const userId = navigation.state.params.presetUserId;

    return (
      <Query query={getDirectMessageThreadByUserIdQuery} variables={{ userId }}>
        {({ data, loading }) => {
          if (loading) {
            return <Loading />;
          }

          if (
            data.directMessageThreadByUserId &&
            data.directMessageThreadByUserId.id
          ) {
            return (
              <DirectMessageThread
                id={data.directMessageThreadByUserId.id}
                {...this.props}
              />
            );
          }

          return <Composer {...this.props} />;
        }}
      </Query>
    );
  }
}

export default DirectMessageComposerContainer;
