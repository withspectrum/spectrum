// @flow
import React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Loading } from 'src/components/loading';
import { Button } from 'src/components/buttons';
import { Input } from 'src/components/formElements';
import addThreadTagsToCommunity, {
  type AddThreadTagsToCommunityInput,
} from 'shared/graphql/mutations/community/addThreadTagsToCommunity';
import type { Dispatch } from 'redux';
import { addToastWithTimeout } from 'src/actions/toasts';
import { getRandomHex } from './tagColors';

type Props = {
  communityId: string,
  addThreadTagsToCommunity: (
    input: AddThreadTagsToCommunityInput
  ) => Promise<void>,
  dispatch: Dispatch<Object>,
};

type State = {
  input: string,
  hex: string,
  loading: boolean,
};

class CreateThreadTag extends React.Component<Props, State> {
  state = {
    title: '',
    loading: false,
    hex: getRandomHex(),
  };

  createThreadTag = e => {
    if (this.state.title.length === 0 || this.state.loading) return;
    if (e) e.preventDefault();

    const { addThreadTagsToCommunity, dispatch } = this.props;

    this.setState({
      loading: true,
    });

    addThreadTagsToCommunity({
      communityId: this.props.communityId,
      tags: [
        {
          title: this.state.title,
          hex: this.state.hex,
        },
      ],
    })
      .then(() => {
        this.setState({
          loading: false,
          title: '',
          hex: getRandomHex(),
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
        });

        return dispatch(addToastWithTimeout('error', err.message));
      });
  };

  changeTitle = e => {
    const title = e.target.value;
    if (title.length >= 24) return;
    this.setState({ title });
  };

  render() {
    return (
      <form
        onSubmit={this.createThreadTag}
        style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
      >
        <Input
          onChange={this.changeTitle}
          value={this.state.title}
          placeholder="Enter new tag title"
          style={{ marginTop: 0, marginRight: 16 }}
        />
        <Button
          loading={this.state.loading}
          disabled={this.state.title.length === 0}
          onClick={this.createThreadTag}
          dataCy="create-thread-tag-button"
        >
          Add
        </Button>
      </form>
    );
  }
}

export default compose(
  connect(),
  addThreadTagsToCommunity
)(CreateThreadTag);
