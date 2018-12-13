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
  type AddThreadTagsToCommunityType,
  type AddThreadTagsToCommunityInput,
} from 'shared/graphql/mutations/community/addThreadTagsToCommunity';
import type { Dispatch } from 'redux';
import { ListContainer } from '../style';
import {
  SectionCard,
  SectionTitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';

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
  loading: boolean,
};

class ChannelList extends React.Component<Props, State> {
  state = {
    input: '',
    loading: false,
  };

  createThreadTag = e => {
    if (this.state.input.length === 0 || this.state.loading) return;
    if (e) e.preventDefault();
    this.setState({
      loading: true,
    });
    this.props
      .addThreadTagsToCommunity({
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
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  };

  changeInput = e => {
    this.setState({
      input: e.target.value,
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
            {community.threadTags.map(tag => (
              <li key={tag.id}>{tag.title}</li>
            ))}
          </ListContainer>

          <SectionCardFooter style={{ alignItems: 'flex-start' }}>
            <form onSubmit={this.createThreadTag}>
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
  viewNetworkHandler
)(ChannelList);
