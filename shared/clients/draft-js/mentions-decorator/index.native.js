// @flow
import React from 'react';
// TODO(@mxstbr): ReactNative throws an error if we try and import react-navigation here
// not sure why, but we need it to open user profiles on mobile when clicking on mentions
// import { withNavigation, type NavigationProps } from 'react-navigation';
import createMentionsDecorator, {
  type MentionComponentPropsType,
} from './core';
import Anchor from '../../../../mobile/components/Anchor';

type Props = {
  // ...NavigationProps,
  ...$Exact<MentionComponentPropsType>,
};

class Mention extends React.Component<Props> {
  openUser = () => {
    // this.props.navigation.navigate('Profile', {
    //   username: this.props.username,
    // });
  };

  render() {
    return <Anchor onPress={this.openUser}>{this.props.children}</Anchor>;
  }
}

export default createMentionsDecorator(Mention);
