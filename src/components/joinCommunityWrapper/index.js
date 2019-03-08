// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import addCommunityMemberMutation from 'shared/graphql/mutations/communityMember/addCommunityMember';
import { addToastWithTimeout } from 'src/actions/toasts';
import { withCurrentUser } from 'src/components/withCurrentUser';
import type { AddCommunityMemberType } from 'shared/graphql/mutations/communityMember/addCommunityMember';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import { openModal } from 'src/actions/modals';

type Props = {
  communityId: string,
  render: Function,
  children: any,
  addCommunityMember: Function,
  dispatch: Dispatch<Object>,
  currentUser: ?GetUserType,
};

const JoinCommunity = (props: Props) => {
  const {
    communityId,
    addCommunityMember,
    dispatch,
    currentUser,
    render,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const addMember = () => {
    if (!currentUser || !currentUser.id) {
      return dispatch(openModal('LOGIN_MODAL'));
    }

    const input = { communityId };

    setIsLoading(true);

    return addCommunityMember({ input })
      .then(({ data }: AddCommunityMemberType) => {
        const { addCommunityMember: community } = data;
        dispatch(
          addToastWithTimeout(
            'success',
            `Welcome to the ${community.name} community!`
          )
        );

        return setIsLoading(false);
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
        return setIsLoading(false);
      });
  };

  return (
    <span style={{ display: 'flex' }} onClick={addMember}>
      {render({ isLoading })}
    </span>
  );
};

export default compose(
  connect(),
  addCommunityMemberMutation,
  withCurrentUser
)(JoinCommunity);
