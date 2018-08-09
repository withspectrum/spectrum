// @flow
import React from 'react';
import compose from 'recompose/compose';
import TouchableHighlight from '../../components/TouchableHighlight';
import {
  getUserById,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';
import {
  SelectedUserPill,
  SelectedUserText,
  SelectedUserRemove,
} from './style';
import Avatar from '../../components/Avatar';

type Props = {
  id: string,
  onPressHandler: Function,
  data: {
    user: ?GetUserType,
  },
};

class SelectedUser extends React.Component<Props> {
  render() {
    const { data, onPressHandler } = this.props;

    if (data.user) {
      const { user } = data;
      return (
        <TouchableHighlight onPress={onPressHandler}>
          <SelectedUserPill>
            <Avatar
              src={user.profilePhoto}
              size={20}
              variant={'circle'}
              style={{ marginRight: 8, marginLeft: -2 }}
            />

            <SelectedUserText>{user.name}</SelectedUserText>

            <SelectedUserRemove>{'✕'}</SelectedUserRemove>
          </SelectedUserPill>
        </TouchableHighlight>
      );
    }

    return null;
  }
}

export default compose(getUserById)(SelectedUser);
