// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import queryString from 'query-string';
import compose from 'recompose/compose';
import { withRouter, type History, type Location } from 'react-router-dom';
import { withCurrentUser } from 'src/components/withCurrentUser';
import SetUsername from './components/setUsername';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import { SERVER_URL, CLIENT_URL } from 'src/api/constants';
import { setTitlebarProps } from 'src/actions/titlebar';
import { ViewGrid, CenteredGrid } from 'src/components/layout';
import Login from 'src/views/login';
import { LogOutButton, Emoji, Heading, Description, Card } from './style';

type Props = {
  currentUser: UserInfoType,
  history: History,
  location: Location,
  dispatch: Dispatch<Object>,
};

class NewUserOnboarding extends React.Component<Props> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      setTitlebarProps({
        title: 'Create username',
      })
    );
  }

  saveUsername = () => {
    const { history, location } = this.props;
    const { state } = location;
    if (state && state.redirect) return history.replace(state.redirect);
    return history.replace('/');
  };

  render() {
    const { currentUser } = this.props;

    let r;
    if (this.props.location) {
      const searchObj = queryString.parse(this.props.location.search);
      r = searchObj.r;
    }

    const redirectPath =
      r !== undefined
        ? // $FlowFixMe
          `${r}`
        : `${CLIENT_URL}/home`;

    if (!currentUser) {
      return <Login githubOnly redirectPath={redirectPath} />;
    }

    if (currentUser && currentUser.username) {
      this.saveUsername();
      return null;
    }

    const heading = 'Create a username';
    const subheading = 'You can change this at any time, so no pressure!';
    const emoji = '👋';
    return (
      <ViewGrid data-cy="new-user-onboarding">
        <CenteredGrid>
          <Card>
            <Emoji role="img" aria-label="Oops">
              {emoji}
            </Emoji>
            <Heading>{heading}</Heading>
            <Description>{subheading}</Description>

            <SetUsername user={currentUser} save={this.saveUsername} />

            <LogOutButton
              data-cy="new-user-onboarding-logout"
              target="_self"
              href={`${SERVER_URL}/auth/logout`}
            >
              Log out
            </LogOutButton>
          </Card>
        </CenteredGrid>
      </ViewGrid>
    );
  }
}

export default compose(
  withRouter,
  withCurrentUser,
  connect()
)(NewUserOnboarding);
