// @flow
import React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Loading } from '../../../components/loading';
import {
  TextButton,
  OutlineButton,
  IconButton,
  Button,
} from '../../../components/buttons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Input } from 'src/components/formElements';
import ViewError from '../../../components/viewError';
import { getCommunityThreadTags } from 'shared/graphql/queries/community/getCommunityThreadTags';
import type { GetCommunityThreadTagsType } from 'shared/graphql/queries/community/getCommunityThreadTags';
import addThreadTagsToCommunity, {
  type AddThreadTagsToCommunityInput,
} from 'shared/graphql/mutations/community/addThreadTagsToCommunity';
import removeThreadTagsFromCommunity, {
  type RemoveThreadTagsFromCommunityInput,
} from 'shared/graphql/mutations/community/removeThreadTagsFromCommunity';
import type { Dispatch } from 'redux';
import { ListContainer } from '../style';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';
import { addToastWithTimeout } from 'src/actions/toasts';
import { getRandomHex } from './tagColors';
import ThreadTag from './threadTag';

type Props = {
  data: {
    community: GetCommunityThreadTagsType,
  },
  addThreadTagsToCommunity: (
    input: AddThreadTagsToCommunityInput
  ) => Promise<void>,
  isLoading: boolean,
  dispatch: Dispatch<Object>,
  id: string,
};

type State = {
  input: string,
  hex: string,
  loading: boolean,
  removing: string,
};

class ChannelList extends React.Component<Props, State> {
  state = {
    input: '',
    loading: false,
    removing: '',
    hex: getRandomHex(),
  };

  createThreadTag = e => {
    if (this.state.input.length === 0 || this.state.loading) return;
    if (e) e.preventDefault();

    const { addThreadTagsToCommunity, dispatch } = this.props;

    this.setState({
      loading: true,
    });

    addThreadTagsToCommunity({
      communityId: this.props.id,
      tags: [
        {
          title: this.state.input,
          hex: this.state.hex,
        },
      ],
    })
      .then(() => {
        this.setState({
          loading: false,
          input: '',
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

  changeInput = e => {
    const input = e.target.value;
    if (input.length >= 24) return;
    this.setState({ input });
  };

  render() {
    const {
      data: { community },
      isLoading,
      dispatch,
    } = this.props;

    if (community) {
      return (
        <SectionCard data-cy="channel-list">
          <SectionTitle>Thread Tags</SectionTitle>
          <SectionSubtitle>
            Team members can add tags to threads, making it easier to find and
            organize conversations in your community.
          </SectionSubtitle>

          <ListContainer style={{ padding: '0 16px' }}>
            {community.threadTags
              // Fake optimistic update for removing tags
              .filter(({ id }) => id !== this.state.removing)
              .sort((a, b) => {
                const x = new Date(a.createdAt).getTime();
                const y = new Date(b.createdAt).getTime();
                return x - y;
              })
              .map(tag => (
                <ThreadTag communityId={this.props.id} tag={tag} key={tag.id} />
              ))}
          </ListContainer>

          <SectionCardFooter>
            <form
              onSubmit={this.createThreadTag}
              style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
            >
              <Input
                onChange={this.changeInput}
                value={this.state.input}
                placeholder="Enter new tag title"
                style={{ marginTop: 0, marginRight: 16 }}
              />
              <Button
                loading={this.state.loading}
                disabled={this.state.input.length === 0}
                onClick={this.createThreadTag}
                dataCy="create-thread-tag-button"
              >
                Add
              </Button>
            </form>
          </SectionCardFooter>
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

    return (
      <SectionCard>
        <ViewError
          refresh
          small
          heading={'We couldn’t load the thread tags for this community.'}
        />
      </SectionCard>
    );
  }
}

export default compose(
  connect(),
  getCommunityThreadTags,
  addThreadTagsToCommunity,
  viewNetworkHandler
)(ChannelList);
