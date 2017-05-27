//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import pure from 'recompose/pure';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingState } from '../../components/loading';
import { UserEditForm } from '../../components/editForm';
import { Upsell404User } from '../../components/upsell';
import SubscriptionList from './components/subscriptionList';
import { GetUserProfile } from './queries';

const UserSettings = ({ data, currentUser, match }) => {
  if (!data.user) {
    return <Upsell404User username={match.params.username} />;
  }

  if (data.user.id !== currentUser.id) {
    return <Upsell404User username={match.params.username} noPermission />;
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <UserEditForm user={data} />
      </Column>

      <Column type="primary">
        <SubscriptionList data={data} />
      </Column>
    </AppViewWrapper>
  );
};

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  GetUserProfile,
  displayLoadingState,
  connect(mapStateToProps),
  pure
)(UserSettings);
