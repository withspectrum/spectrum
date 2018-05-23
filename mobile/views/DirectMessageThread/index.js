// @flow
import React from 'react';
import idx from 'idx';
import Text from '../../components/Text';

import DirectMessageThread from './components/DirectMessageThread';
import { Wrapper } from './style';

type Props = {
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
      <Wrapper>
        <DirectMessageThread id={id} />
      </Wrapper>
    );
  }
}

export default DirectMessageThreadView;
