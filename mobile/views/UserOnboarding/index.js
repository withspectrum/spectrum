// @flow
import React from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import { debounce } from 'throttle-debounce';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import Loading from '../../components/Loading';
import Text from '../../components/Text';
import { Button } from '../../components/Button';
import { getUserByUsernameQuery } from '../../../shared/graphql/queries/user/getUser';
import editUser, {
  type EditUserProps,
} from '../../../shared/graphql/mutations/user/editUser';

import styled, { css } from 'styled-components/native';

const UserOnboardingWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
`;

const Spacer = styled.View`
  ${props =>
    props.vertical &&
    css`
      margin-top: ${props.vertical * 8}px;
      margin-bottom: ${props.vertical * 8}px;
    `};
`;

const UsernameInput = styled.TextInput.attrs({
  autoCapitalize: 'none',
  autoCorrect: false,
})`
  background: ${props => props.theme.bg.default};
  width: 100%;
  padding: 12px 24px;
  border-width: 2px;
  border-color: ${props => props.theme.bg.border};
  border-radius: 8px;
`;

type Props = {
  ...$Exact<EditUserProps>,
  client: Object,
  onFinish: Function,
};

type State = {
  username: string,
  validating: boolean,
  result: 'available' | 'taken' | null,
};

class SetUsernameComponent extends React.Component<Props, State> {
  state = {
    username: '',
    validating: false,
    result: null,
  };

  onChangeText = (text: string) => {
    this.setState({
      username: text,
      result: null,
    });
    this.validateUsername();
  };

  validateUsername = debounce(500, () => {
    if (this.state.username.length === 0) return;
    this.setState({
      validating: true,
    });
    this.props.client
      .query({
        query: getUserByUsernameQuery,
        variables: { username: this.state.username },
      })
      .then(({ data: { user } }) => {
        this.setState({
          validating: false,
          result: user && user.id ? 'taken' : 'available',
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          validating: false,
        });
      });
  });

  saveUsername = () => {
    const { username } = this.state;
    if (username.length === 0) return;
    this.props
      .editUser({ username })
      .then(() => {
        this.props.onFinish();
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { username, validating, result } = this.state;
    return (
      <UserOnboardingWrapper>
        <Text type="largeTitle" style={{ fontSize: 56, lineHeight: 64 }}>
          👋
        </Text>
        <Spacer vertical={1} />
        <Text type="title1" bold>
          Welcome to Spectrum!
        </Text>
        <Text type="callout" style={{ textAlign: 'center' }}>
          Spectrum is a place where communities can share, discuss and grow
          together. To get started, create a username.
        </Text>
        <Spacer vertical={2} />
        <Text type="headline" bold>
          Create your username
        </Text>
        <Text type="subhead">You can change this later—no pressure!</Text>
        <Spacer vertical={1} />
        <UsernameInput onChangeText={this.onChangeText} value={username} />
        {result === 'available' && (
          <Text type="caption1" color={props => props.theme.success.default}>
            That username is available!
          </Text>
        )}
        {result === 'taken' && (
          <Text type="caption1" color={props => props.theme.warn.default}>
            Someone already swooped that username.
          </Text>
        )}
        <Spacer vertical={2} />
        <Button
          title="Save and Continue"
          onPress={this.saveUsername}
          state={
            !validating && result === 'available'
              ? undefined
              : validating ? 'loading' : 'disabled'
          }
        />
      </UserOnboardingWrapper>
    );
  }
}

const SetUsername = compose(withApollo, editUser)(SetUsernameComponent);

type UserOnboardingState = {
  step: 'username-selection' | 'community-joining',
};

class UserOnboarding extends React.Component<{}, UserOnboardingState> {
  state = {
    step: 'username-selection',
  };

  moveToExplore = () => {
    this.setState({
      step: 'community-joining',
    });
  };

  render() {
    const { step } = this.state;
    if (step === 'username-selection')
      return <SetUsername onFinish={this.moveToExplore} />;
    if (step === 'community-joining')
      return <Text>Join some communities!</Text>;
    return null;
  }
}

export default UserOnboarding;
