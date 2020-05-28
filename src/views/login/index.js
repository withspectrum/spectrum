// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { OutlineButton } from 'src/components/button';
import FullscreenView from 'src/components/fullscreenView';
import LoginButtonSet from 'src/components/loginButtonSet';
import {
  LargeTitle,
  LargeSubtitle,
  FullscreenContent,
  CodeOfConduct,
} from './style';
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
    const { dispatch } = this.props;
    dispatch(setTitlebarProps({ title: 'Login' }));
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
            >
              Code of Conduct
            </a>
            ,{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                'https://help.github.com/en/github/site-policy/github-privacy-statement'
              }
            >
              Privacy Statement
            </a>
            {', and '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                'https://help.github.com/en/github/site-policy/github-terms-of-service'
              }
            >
              Terms of Service
            </a>
            .
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
