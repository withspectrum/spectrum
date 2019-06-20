// @flow
import * as React from 'react';
import { getItemFromStorage, storeItem } from 'src/helpers/localStorage';
import { TextButton } from 'src/components/button';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import { SERVER_URL, CLIENT_URL } from '../../api/constants';
import { Container } from './style';
import { TwitterSigninButton } from './twitter';
import { FacebookSigninButton } from './facebook';
import { GoogleSigninButton } from './google';
import { GithubSigninButton } from './github';
import { track, events } from 'src/helpers/analytics';

type Props = {
  redirectPath: ?string,
  location: Object,
};

export type ButtonProps = {
  onClickHandler?: ?Function,
  href: string,
  preferred: boolean,
  showAfter: boolean,
  githubOnly?: boolean,
};

class LoginButtonSet extends React.Component<Props> {
  saveLoginMethod = (type: string) => {
    track(events.LOGIN_PAGE_AUTH_CLICKED, { provider: type });
    return storeItem('preferred_signin_method', type);
  };

  render() {
    const { redirectPath, location, githubOnly } = this.props;

    let r;
    if (location) {
      const searchObj = queryString.parse(this.props.location.search);
      r = searchObj.r;
    }

    const postAuthRedirectPath =
      redirectPath !== undefined || r !== undefined
        ? // $FlowFixMe
          `?r=${redirectPath || r}`
        : `?r=${CLIENT_URL}/home`;

    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    let nonePreferred = false;
    if (!preferredSigninMethod) {
      nonePreferred = true;
    }

    return (
      <React.Fragment>
        <Container>
          {!githubOnly && (
            <React.Fragment>
              <TwitterSigninButton
                onClickHandler={this.saveLoginMethod}
                href={`${SERVER_URL}/auth/twitter${postAuthRedirectPath}`}
                preferred={
                  nonePreferred ? true : preferredSigninMethod === 'twitter'
                }
                showAfter={preferredSigninMethod === 'twitter'}
              />

              <FacebookSigninButton
                onClickHandler={this.saveLoginMethod}
                href={`${SERVER_URL}/auth/facebook${postAuthRedirectPath}`}
                preferred={
                  nonePreferred ? true : preferredSigninMethod === 'facebook'
                }
                showAfter={preferredSigninMethod === 'facebook'}
              />

              <GoogleSigninButton
                onClickHandler={this.saveLoginMethod}
                href={`${SERVER_URL}/auth/google${postAuthRedirectPath}`}
                preferred={
                  nonePreferred ? true : preferredSigninMethod === 'google'
                }
                showAfter={preferredSigninMethod === 'google'}
              />
            </React.Fragment>
          )}

          <GithubSigninButton
            githubOnly={githubOnly}
            onClickHandler={this.saveLoginMethod}
            href={`${SERVER_URL}/auth/github${postAuthRedirectPath}`}
            preferred={
              githubOnly
                ? true
                : nonePreferred
                ? true
                : preferredSigninMethod === 'github'
            }
            showAfter={preferredSigninMethod === 'github'}
          />
        </Container>

        {!githubOnly && (
          <React.Fragment>
            <div style={{ padding: '16px' }} />
            <TextButton to={'/new/user'}>
              New to Spectrum? Click here to sign up.
            </TextButton>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(LoginButtonSet);
