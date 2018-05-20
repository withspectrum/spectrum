// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getChannelSettings, {
  type GetChannelSettingsType,
} from 'shared/graphql/queries/channel/getChannelSettings';
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
import type { Dispatch } from 'redux';

type Props = {
  data: {
    channel: GetChannelSettingsType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  saveBrandedLoginSettings: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoading: boolean,
};

class LoginTokenSettings extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  render() {
    const { data: { channel }, isLoading } = this.props;

    if (channel) {
      const { joinSettings } = channel;

      return (
        <SectionCard data-cy="login-with-token-settings">
          <SectionTitle>Join channel via link</SectionTitle>
          <SectionSubtitle>
            Allow people to join this private channel by visiting a unique link.
            Anyone with this link will be able to join this channel.
          </SectionSubtitle>

          <LoginTokenToggle settings={joinSettings} id={channel.id} />

          {joinSettings.tokenJoinEnabled && (
            <Clipboard
              style={{ background: 'none' }}
              data-clipboard-text={`${CLIENT_URL}/${channel.community.slug}/${
                channel.slug
              }/join/${joinSettings.token}`}
              onSuccess={() =>
                this.props.dispatch(
                  addToastWithTimeout('success', 'Copied to clipboard')
                )
              }
            >
              <TokenInputWrapper>
                <Input
                  value={`${CLIENT_URL}/${channel.community.slug}/${
                    channel.slug
                  }/join/${joinSettings.token}`}
                  onChange={() => {}}
                  dataCy={'join-link-input'}
                />
              </TokenInputWrapper>
            </Clipboard>
          )}

          {joinSettings.tokenJoinEnabled && <ResetJoinToken id={channel.id} />}
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

export default compose(getChannelSettings, viewNetworkHandler, connect())(
  LoginTokenSettings
);
