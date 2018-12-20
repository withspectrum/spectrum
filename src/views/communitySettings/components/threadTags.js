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
  SectionCardFooter,
} from '../../../components/settingsViews/style';
import { addToastWithTimeout } from 'src/actions/toasts';

type Props = {
  data: {
    community: GetCommunityThreadTagsType,
  },
  addThreadTagsToCommunity: (
    input: AddThreadTagsToCommunityInput
  ) => Promise<void>,
  removeThreadTagsFromCommunity: (
    input: RemoveThreadTagsFromCommunityInput
  ) => Promise<void>,
  isLoading: boolean,
  dispatch: Dispatch<Object>,
  id: string,
};

type State = {
  input: string,
  loading: boolean,
  removing: string,
};

class ChannelList extends React.Component<Props, State> {
  state = {
    input: '',
    loading: false,
    removing: '',
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
        },
      ],
    })
      .then(() => {
        this.setState({
          loading: false,
          input: '',
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
    this.setState({
      input: e.target.value,
    });
  };

  removeThreadTag = (id: string) => {
    if (!id) return;
    this.setState({
      removing: id,
    });
    this.props
      .removeThreadTagsFromCommunity({
        communityId: this.props.id,
        tagIds: [id],
      })
      .then(() => {
        this.setState({
          removing: '',
        });
      })
      .catch(() => {
        this.setState({
          removing: '',
        });
      });
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

          <ListContainer style={{ padding: '0 16px' }}>
            {community.threadTags
              // Fake optimistic update for removing tags
              .filter(({ id }) => id !== this.state.removing)
              .map(tag => (
                <li key={tag.id}>
                  {tag.title}{' '}
                  <button onClick={() => this.removeThreadTag(tag.id)}>
                    X
                  </button>
                </li>
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
              <TextButton
                icon={'plus'}
                loading={this.state.loading}
                disabled={this.state.input.length === 0}
                onClick={this.createThreadTag}
                color="brand.default"
                dataCy="create-thread-tag-button"
              >
                Add
              </TextButton>
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
  removeThreadTagsFromCommunity,
  viewNetworkHandler
)(ChannelList);
