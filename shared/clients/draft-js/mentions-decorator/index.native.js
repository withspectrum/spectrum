// @flow
import React from 'react';
import { withNavigation, type NavigationProps } from 'react-navigation';
import createMentionsDecorator, {
  type MentionComponentPropsType,
} from './core';
import Anchor from '../../../../mobile/components/Anchor';

type Props = {
  ...NavigationProps,
  ...MentionComponentPropsType,
};

class Mention extends React.Component<Props> {
  openUser = () => {
    this.props.navigation.navigate('Profile', {
      username: this.props.username,
    });
  };

  render() {
    return <Anchor onPress={this.openUser}>{this.props.children}</Anchor>;
  }
}

export default createMentionsDecorator(withNavigation(Mention));
