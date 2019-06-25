// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { OutlineButton } from 'src/components/button';
import FullscreenView from 'src/components/fullscreenView';
import LoginButtonSet from 'src/components/loginButtonSet';
import {
  LargeTitle,
  LargeSubtitle,
  FullscreenContent,
  CodeOfConduct,
} from './style';
import queryString from 'query-string';
import { track, events } from 'src/helpers/analytics';
import { CLIENT_URL } from 'src/api/constants';
import { setTitlebarProps } from 'src/actions/titlebar';

type Props = {
  redirectPath: ?string,
  signinType?: ?string,
  close?: Function,
  location?: Object,
  dispatch: Function,
  githubOnly?: boolean,
};

class Login extends React.Component<Props> {
  componentDidMount() {
    let redirectPath;
    const { dispatch } = this.props;
    dispatch(setTitlebarProps({ title: 'Login' }));

    if (this.props.location) {
      const searchObj = queryString.parse(this.props.location.search);
      redirectPath = searchObj.r;
    }

    track(events.LOGIN_PAGE_VIEWED, { redirectPath });
  }

  render() {
    const { redirectPath, signinType = 'signin', githubOnly } = this.props;

    return (
      <FullscreenView closePath={CLIENT_URL}>
        <FullscreenContent
          data-cy="login-page"
          style={{ justifyContent: 'center' }}
        >
          <LargeTitle>{githubOnly ? 'Sign up' : 'Log in'}</LargeTitle>
          {githubOnly && (
            <LargeSubtitle>
              New accounts on Spectrum can only be created by signing up with
              GitHub.
            </LargeSubtitle>
          )}

          <LoginButtonSet
            githubOnly={githubOnly}
            redirectPath={redirectPath}
            signinType={signinType}
          />

          {githubOnly && (
            <OutlineButton
              css={{ width: '100%' }}
              to={`/login?r=${redirectPath || `${CLIENT_URL}/home`}`}
            >
              Existing user? Click here to log in
            </OutlineButton>
          )}

          <CodeOfConduct>
            By using Spectrum, you agree to our{' '}
            <a
              href="https://github.com/withspectrum/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track(events.CODE_OF_CONDUCT_CLICKED, { location: 'login' })
              }
            >
              Code of Conduct
            </a>
            , <Link to={'/privacy'}>Privacy Policy</Link> and{' '}
            <Link to={'/terms'}>Terms of Service</Link>.
          </CodeOfConduct>
        </FullscreenContent>
      </FullscreenView>
    );
  }
}

export default compose(
  withRouter,
  connect()
)(Login);
