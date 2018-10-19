// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunitySettings, {
  type GetCommunitySettingsType,
} from 'shared/graphql/queries/community/getCommunitySettings';
import Clipboard from 'react-clipboard.js';
import { Loading } from 'src/components/loading';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from 'src/components/settingsViews/style';
import LoginTokenToggle from './joinTokenToggle';
import ResetJoinToken from './resetJoinToken';
import { Input } from 'src/components/formElements';
import { addToastWithTimeout } from 'src/actions/toasts';
import { TokenInputWrapper } from '../style';
import { CLIENT_URL } from 'src/api/constants';

type Props = {
  data: {
    community: GetCommunitySettingsType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class JoinTokenSettings extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  render() {
    const { data: { community }, isLoading } = this.props;

    if (community) {
      const { joinSettings } = community;

      return (
        <SectionCard data-cy="login-with-token-settings">
          <SectionTitle>Join community via link</SectionTitle>
          <SectionSubtitle>
            Allow people to join this private community by visiting a unique
            link. Anyone with this link will be able to join this community.
          </SectionSubtitle>

          <LoginTokenToggle settings={joinSettings} id={community.id} />

          {joinSettings.tokenJoinEnabled && (
            <Clipboard
              style={{ background: 'none' }}
              data-clipboard-text={`${CLIENT_URL}/${community.slug}/join/${
                joinSettings.token
              }`}
              onSuccess={() =>
                this.props.dispatch(
                  addToastWithTimeout('success', 'Copied to clipboard')
                )
              }
            >
              <TokenInputWrapper>
                <Input
                  value={`${CLIENT_URL}/${community.slug}/join/${
                    joinSettings.token
                  }`}
                  onChange={() => {}}
                  dataCy={'join-link-input'}
                />
              </TokenInputWrapper>
            </Clipboard>
          )}

          {joinSettings.tokenJoinEnabled && (
            <ResetJoinToken id={community.id} />
          )}
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(getCommunitySettings, viewNetworkHandler, connect())(
  JoinTokenSettings
);
