// @flow
import React from 'react';
import slugg from 'slugg';
import { KeyboardAvoidingView } from 'react-native';
import { debounce } from 'throttle-debounce';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import { Button } from '../../components/Button';
import { getUserByUsernameQuery } from '../../../shared/graphql/queries/user/getUser';
import editUser, {
  type EditUserProps,
} from '../../../shared/graphql/mutations/user/editUser';
import {
  UserOnboardingWrapper,
  UsernameInput,
  ViewTitle,
  ViewSubtitle,
  SaveButtonWrapper,
  AvailableLabel,
  AvailableLabelWrapper,
} from './style';

type Props = {
  ...$Exact<EditUserProps>,
  client: Object,
  onFinish: Function,
};

type State = {
  username: string,
  result: 'available' | 'taken' | null,
  isValid: boolean,
};

class SetUsername extends React.Component<Props, State> {
  state = {
    username: '',
    result: null,
    isValid: true,
  };

  onChangeText = (text: string) => {
    const username = slugg(text.trim());

    if (!username || username.length === 0) {
      return this.setState({
        username,
        result: null,
        isValid: true,
      });
    }

    this.setState({
      username,
      result: null,
    });

    if (!this.isUsernameValid(username)) {
      return this.setState({ isValid: false });
    }

    this.setState({ isValid: true });
    return this.searchUsername();
  };

  isUsernameValid = username => username.length > 0 && username.length <= 20;

  searchUsername = debounce(500, () => {
    this.props.client
      .query({
        query: getUserByUsernameQuery,
        variables: { username: this.state.username },
      })
      .then(({ data: { user } }) => {
        this.setState({
          result: user && user.id ? 'taken' : 'available',
        });
      })
      .catch(err => {
        // do something here if the search fails
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
        // do something here if this fails
      });
  };

  render() {
    const { username, result, isValid } = this.state;

    return (
      <UserOnboardingWrapper>
        <KeyboardAvoidingView behavior="position" enabled>
          <ViewTitle>Create your username</ViewTitle>

          <ViewSubtitle>
            Your username helps people recognize you on Spectrum. It can be
            changed at any time so there's no pressure to get it perfect right
            now!
          </ViewSubtitle>

          <UsernameInput
            onChangeText={this.onChangeText}
            value={username}
            placeholder={'What’s your username?'}
            borderColor={theme =>
              result
                ? result === 'available' && isValid
                  ? theme.success.alt
                  : theme.warn.alt
                : isValid ? theme.bg.border : theme.warn.alt
            }
          />

          <AvailableLabelWrapper>
            {!isValid && (
              <AvailableLabel available={false}>
                Usernames must be less than 20 characters - try another?
              </AvailableLabel>
            )}
            {result === 'taken' && (
              <AvailableLabel available={false}>
                Someone already swooped that username - try another?
              </AvailableLabel>
            )}
          </AvailableLabelWrapper>

          <SaveButtonWrapper>
            <Button
              title="Save and Continue"
              onPress={this.saveUsername}
              state={
                !isValid || !result || result === 'taken'
                  ? 'disabled'
                  : undefined
              }
            />
          </SaveButtonWrapper>
        </KeyboardAvoidingView>
      </UserOnboardingWrapper>
    );
  }
}

export default compose(withApollo, editUser)(SetUsername);
