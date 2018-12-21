// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Loading } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { getCommunityThreadTags } from 'shared/graphql/queries/community/getCommunityThreadTags';
import type { GetCommunityThreadTagsType } from 'shared/graphql/queries/community/getCommunityThreadTags';
import { ListContainer } from '../style';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import ThreadTag from './threadTag';
import CreateThreadTag from './createThreadTag';

type Props = {
  data: {
    community: GetCommunityThreadTagsType,
  },
  isLoading: boolean,
  id: string,
};

class ThreadTags extends React.Component<Props> {
  render() {
    const {
      data: { community },
      isLoading,
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
              .sort((a, b) => {
                const x = new Date(a.createdAt).getTime();
                const y = new Date(b.createdAt).getTime();
                return x - y;
              })
              .map(tag => (
                <ThreadTag
                  editable
                  communityId={this.props.id}
                  tag={tag}
                  key={tag.id}
                />
              ))}
          </ListContainer>

          <SectionCardFooter>
            <CreateThreadTag communityId={this.props.id} />
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
  viewNetworkHandler
)(ThreadTags);
