// @flow
import * as React from 'react';
import slugg from 'slugg';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { getUserByUsernameQuery } from 'shared/graphql/queries/user/getUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import { debounce } from 'src/helpers/utils';
import { Spinner } from '../globals';
import { Input, Loading } from './style';

type Props = {
  client: Object,
  username: string,
  label: string,
  size: string,
  onValidationResult: ({
    error: string,
    success: string,
    username?: string,
  }) => void,
  onError: ?(err: Error) => void,
  dataCy?: string,
};

type State = {
  username: string,
  isSearching: boolean,
};

class UsernameSearch extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { username } = props;

    this.state = {
      username: slugg(username),
      isSearching: false,
    };

    this.search = debounce(this.search, 500, false);
  }

  componentDidMount() {
    const { username } = this.state;
    // if no username was able to be suggested, don't kick off a search
    // with an empty string
    if (username.length === 0) return;

    // $FlowIssue
    this.search(username);
  }

  handleChange = e => {
    const username = slugg(e.target.value.trim());

    this.setState({
      isSearching: false,
      username,
    });

    if (!this.isUsernameValid(username)) {
      return this.notifyParentWithValidationResult(username);
    }

    this.props.onValidationResult({
      error: '',
      success: '',
    });

    // $FlowIssue
    return this.search(username);
  };

  isUsernameValid = username => username.length > 0 && username.length <= 20;

  notifyParentWithValidationResult = username => {
    if (username.length > 20) {
      this.props.onValidationResult({
        error: 'Usernames can be up to 20 characters',
        success: '',
      });
    } else if (username.length === 0) {
      this.props.onValidationResult({
        error: 'Be sure to set a username so that people can find you!',
        success: '',
      });
    } else {
      this.props.onValidationResult({
        error: '',
        success: '',
      });
    }
  };

  search = (username: string) => {
    // username in state could not be the same as username argument here
    // so dont make a call with previous username
    if (!this.isUsernameValid(this.state.username)) return;

    // username argument here is already validated
    this.setState({
      isSearching: true,
    });

    // check the db to see if this channel slug exists
    this.props.client
      .query({
        query: getUserByUsernameQuery,
        variables: {
          username,
        },
      })
      .then(({ data: { user } }: { data: { user: GetUserType } }) => {
        if (user && user.id) {
          this.props.onValidationResult({
            error: 'That username has already been taken.',
            success: '',
            username,
          });
        } else {
          this.props.onValidationResult({
            error: '',
            success: 'That username is available!',
            username,
          });
        }
        this.setState({
          isSearching: false,
        });
      })
      .catch(err => {
        this.props.onError && this.props.onError(err);
        this.setState({
          isSearching: false,
        });
      });
  };

  render() {
    const { username, isSearching } = this.state;
    // eslint-disable-next-line
    const { label, size, dataCy, onValidationResult, ...rest } = this.props;
    return (
      <React.Fragment>
        <Input
          {...rest}
          size={size}
          defaultValue={username}
          onChange={this.handleChange}
          dataCy={dataCy}
        >
          {label && label}
          {isSearching && (
            <Loading size={size}>
              <Spinner size={16} color={'brand.default'} />
            </Loading>
          )}
        </Input>
      </React.Fragment>
    );
  }
}

export default compose(
  withApollo,
  connect()
)(UsernameSearch);
