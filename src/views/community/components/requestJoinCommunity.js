// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import addPendingCommunityMemberMutation from 'shared/graphql/mutations/communityMember/addPendingCommunityMember';
import removePendingCommunityMemberMutation from 'shared/graphql/mutations/communityMember/removePendingCommunityMember';
import { addToastWithTimeout } from 'src/actions/toasts';

type Props = {
  communityId: string,
  render: Function,
  children: any,
  addPendingCommunityMember: Function,
  removePendingCommunityMember: Function,
  dispatch: Dispatch<Object>,
  isPending: boolean,
};

const RequestJoinCommunity = (props: Props) => {
  const {
    communityId,
    dispatch,
    render,
    isPending,
    addPendingCommunityMember,
    removePendingCommunityMember,
  } = props;

  const input = { communityId };

  const [isLoading, setIsLoading] = React.useState(false);

  const sendRequest = () => {
    setIsLoading(true);

    return addPendingCommunityMember({ input })
      .then(() => {
        setIsLoading(false);
        return dispatch(addToastWithTimeout('success', 'Request sent!'));
      })
      .catch(err => {
        setIsLoading(false);
        return dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const cancelRequest = () => {
    setIsLoading(true);

    return removePendingCommunityMember({ input })
      .then(() => {
        setIsLoading(false);

        return dispatch(addToastWithTimeout('success', 'Request canceled'));
      })
      .catch(err => {
        setIsLoading(false);

        return dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const cy = isPending
    ? 'cancel-request-to-join-private-community-button'
    : 'request-to-join-private-community-button';

  return (
    <span
      data-cy={cy}
      style={{ display: 'flex' }}
      onClick={isPending ? cancelRequest : sendRequest}
    >
      {render({ isLoading })}
    </span>
  );
};

export default compose(
  connect(),
  addPendingCommunityMemberMutation,
  removePendingCommunityMemberMutation
)(RequestJoinCommunity);
