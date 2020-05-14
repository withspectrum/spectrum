// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import FullscreenView from 'src/components/fullscreenView';
import LoginButtonSet from 'src/components/loginButtonSet';
import { CommunityAvatar } from 'src/components/avatar';
import { CLIENT_URL } from 'src/api/constants';
import {
  Title,
  Subtitle,
  LoginImageContainer,
  FullscreenContent,
  CodeOfConduct,
} from './style';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import {
  getCommunityByMatch,
  type GetCommunityType,
} from 'shared/graphql/queries/community/getCommunity';
import queryString from 'query-string';
import { LoadingView, ErrorView } from 'src/views/viewHelpers';
import { OutlineButton } from 'src/components/button';

type Props = {
  data: {
    community: GetCommunityType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  history: Object,
  location: Object,
  match: Object,
  redirectPath: ?string,
};

type State = {
  redirectPath: ?string,
};

export class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirectPath: props.redirectPath,
    };
  }

  escape = () => {
    this.props.history.push(`/${this.props.match.params.communitySlug}`);
  };

  componentDidMount() {
    const { location, redirectPath } = this.props;

    if (redirectPath) {
      this.setState({ redirectPath });
    }

    if (location && !redirectPath) {
      const searchObj = queryString.parse(this.props.location.search);
      this.setState({ redirectPath: searchObj.r });
    }
  }

  render() {
    const {
      data: { community },
      isLoading,
      match,
    } = this.props;
    const { redirectPath } = this.state;

    if (community && community.id) {
      const { brandedLogin } = community;

      return (
        <FullscreenView closePath={`${CLIENT_URL}`}>
          <FullscreenContent
            data-cy="community-login-page"
            style={{ justifyContent: 'center' }}
          >
            <LoginImageContainer>
              <CommunityAvatar
                community={community}
                showHoverProfile={false}
                size={88}
              />
            </LoginImageContainer>
            <Title>Sign up to join the {community.name} community</Title>
            <Subtitle>
              {brandedLogin.message && brandedLogin.message.length > 0
                ? brandedLogin.message
                : 'Spectrum is a place where communities can share, discuss, and grow together. Sign in below to get in on the conversation.'}
            </Subtitle>

            <LoginButtonSet
              redirectPath={
                redirectPath || `${CLIENT_URL}/${match.params.communitySlug}`
              }
              signinType={'signin'}
              githubOnly
            />

            <OutlineButton
              css={{ width: '100%' }}
              to={`/login?r=${redirectPath ||
                `${CLIENT_URL}/${match.params.communitySlug}`}`}
            >
              Existing user? Click here to log in
            </OutlineButton>

            <CodeOfConduct>
              By using Spectrum, you agree to our{' '}
              <a
                href="https://github.com/withspectrum/code-of-conduct"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code of Conduct
              </a>
            </CodeOfConduct>
          </FullscreenContent>
        </FullscreenView>
      );
    }

    if (isLoading) return <LoadingView />;

    return <ErrorView />;
  }
}

export default compose(
  getCommunityByMatch,
  viewNetworkHandler
)(Login);
