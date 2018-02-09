// @flow
import * as React from 'react';
import { getItemFromStorage, storeItem } from '../../helpers/localStorage';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import { SERVER_URL, CLIENT_URL } from '../../api/constants';
import Icon from '../icons';
import {
  Container,
  TwitterButton,
  GoogleButton,
  FacebookButton,
  GithubButton,
  Label,
} from './style';

type Props = {
  redirectPath: ?string,
  location: Object,
  signinType: string,
};

class LoginButtonSet extends React.Component<Props> {
  saveLoginMethod = (type: string) => {
    return storeItem('preferred_signin_method', type);
  };

  render() {
    const { redirectPath, location, signinType } = this.props;

    const verb = signinType === 'login' ? 'Log in ' : 'Sign in ';

    let r;
    if (location) {
      const searchObj = queryString.parse(this.props.location.search);
      r = searchObj.r;
    }

    const postAuthRedirectPath =
      redirectPath !== undefined || r !== undefined
        ? `?r=${redirectPath || r}`
        : `?r=${CLIENT_URL}/home`;

    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    let nonePreferred = false;
    if (!preferredSigninMethod) {
      nonePreferred = true;
    }

    return (
      <Container>
        <a
          onClick={() => this.saveLoginMethod('twitter')}
          href={`${SERVER_URL}/auth/twitter${postAuthRedirectPath}`}
        >
          <TwitterButton
            showAfter={preferredSigninMethod === 'twitter'}
            preferred={
              nonePreferred ? true : preferredSigninMethod === 'twitter'
            }
          >
            <Icon glyph={'twitter'} />
            <Label>{verb} with Twitter</Label>
          </TwitterButton>
        </a>

        <a
          onClick={() => this.saveLoginMethod('facebook')}
          href={`${SERVER_URL}/auth/facebook${postAuthRedirectPath}`}
        >
          <FacebookButton
            showAfter={preferredSigninMethod === 'facebook'}
            preferred={
              nonePreferred ? true : preferredSigninMethod === 'facebook'
            }
          >
            <Icon glyph={'facebook'} />
            <Label>{verb} with Facebook</Label>
          </FacebookButton>
        </a>

        <a
          onClick={() => this.saveLoginMethod('google')}
          href={`${SERVER_URL}/auth/google${postAuthRedirectPath}`}
        >
          <GoogleButton
            showAfter={preferredSigninMethod === 'google'}
            preferred={
              nonePreferred ? true : preferredSigninMethod === 'google'
            }
          >
            <Icon glyph={'google'} />
            <Label>{verb} with Google</Label>
          </GoogleButton>
        </a>

        <a
          onClick={() => this.saveLoginMethod('github')}
          href={`${SERVER_URL}/auth/github${postAuthRedirectPath}`}
        >
          <GithubButton
            showAfter={preferredSigninMethod === 'github'}
            preferred={
              nonePreferred ? true : preferredSigninMethod === 'github'
            }
          >
            <Icon glyph={'github'} />
            <Label>{verb} with GitHub</Label>
          </GithubButton>
        </a>
      </Container>
    );
  }
}

export default withRouter(LoginButtonSet);
