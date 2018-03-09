// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import FullscreenView from 'src/components/fullscreenView';
import LoginButtonSet from 'src/components/loginButtonSet';
import { Loading } from 'src/components/loading';
import Avatar from 'src/components/avatar';
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
import ViewError from 'src/components/viewError';

type Props = {
  data: {
    community: GetCommunityType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  history: Object,
  match: Object,
};

export class Login extends React.Component<Props> {
  escape = () => {
    this.props.history.push(`/${this.props.match.params.communitySlug}`);
  };
  render() {
    const { data: { community }, isLoading } = this.props;

    if (community && community.id) {
      const { brandedLogin } = community;

      return (
        <FullscreenView hasBackground noCloseButton={true} close={null}>
          <FullscreenContent
            data-e2e-id="community-login-page"
            style={{ justifyContent: 'center' }}
          >
            <LoginImageContainer>
              <Avatar
                community={community}
                size={'88'}
                src={community.profilePhoto}
              />
            </LoginImageContainer>
            <Title>Log in to the {community.name} community</Title>
            <Subtitle>
              {brandedLogin.customMessage &&
              brandedLogin.customMessage.length > 0
                ? brandedLogin.customMessage
                : 'Spectrum is a place where communities can share, discuss, and grow together. Sign in below to get in on the conversation.'}
            </Subtitle>

            <LoginButtonSet signinType={'signin'} />

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

    if (isLoading) {
      return (
        <FullscreenView>
          <Loading />
        </FullscreenView>
      );
    }

    return (
      <FullscreenView close={this.escape}>
        <ViewError
          refresh
          heading={'We had trouble finding this community'}
          subheading={
            'Double check that this community exists or refresh to try again'
          }
        />
      </FullscreenView>
    );
  }
}

export default compose(getCommunityByMatch, viewNetworkHandler)(Login);
