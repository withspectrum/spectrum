// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { SEARCH_THREADS_QUERY } from '../../api/thread';
import { ReactElement } from 'react';
import { throttle } from '../../helpers/utils';
import { StyledForm } from './style';

type Props = {
  onResults: Function,
  onError: Function,
  onEmptyField: Function, // when user empty the field
  placeholder: string,
  filter: ?Object,
  client: Function,
  StyledComponent: ReactElement,
};

type State = {
  value: string,
};
class ThreadsAlgoliaInput extends React.Component<Props, State> {
  constructor() {
    super();

    this.submit = throttle(this.submit, 1000);
    this.state = { value: '' };
  }

  submit = e => {
    e.preventDefault();

    const {
      filter = {},
      onEmptyField,
      onResults,
      onError,
      client,
    } = this.props;
    const { value } = this.state;

    if (value && value.length > 0) {
      client
        .query({
          query: SEARCH_THREADS_QUERY,
          variables: {
            queryString: value,
            filter: {
              ...filter,
            },
          },
        })
        .then(({ data: { searchThreads }, data }) => {
          console.log('data', data);
          console.log('searchThreads', searchThreads);
          if (searchThreads && onResults) {
            onResults(searchThreads);
          }
        })
        .catch(err => {
          if (err && onError) {
            onError(err);
          }
        });
    } else if (onEmptyField) {
      onEmptyField();
    }
  };

  change = e => {
    if (e.target.value) {
      this.setState({ value: e.target.value });
    }
  };

  render() {
    const { StyledComponent } = this.props;

    return (
      <StyledForm onSubmit={this.submit}>
        <StyledComponent
          style={{ WebkitUserSelect: 'auto', userSelect: 'auto' }}
          placeholder={this.props.placeholder}
          type="text"
          onKeyUp={this.change}
        />
      </StyledForm>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
// $FlowIssue
export default compose(connect(map), withApollo)(ThreadsAlgoliaInput);
