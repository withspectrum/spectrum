// @flow
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { collections } from './collections';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  ListWithTitle,
  ListTitle,
  ListWrapper,
  Collections,
  CollectionWrapper,
  ProfileCardWrapper,
} from './style';
import { getCommunitiesBySlug } from 'shared/graphql/queries/community/getCommunities';
import type { GetCommunitiesType } from 'shared/graphql/queries/community/getCommunities';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { ErrorBoundary } from 'src/components/error';
import { Loading } from 'src/components/loading';
import { ErrorView } from 'src/views/viewHelpers';
import { CommunityProfileCard } from 'src/components/entities';

const ChartGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

export const Charts = () => {
  return <ChartGrid>{collections && <CollectionSwitcher />}</ChartGrid>;
};

type State = {
  selectedView: string,
};

class CollectionSwitcher extends React.Component<{}, State> {
  state = {
    selectedView: 'top-communities-by-members',
  };

  parentRef = null;
  ref = null;

  componentDidMount() {
    this.parentRef = document.getElementById('main');
  }

  handleSegmentClick(selectedView) {
    if (this.state.selectedView === selectedView) return;

    return this.setState({ selectedView });
  }

  componentDidUpdate(prevProps, prevState) {
    const currState = this.state;
    if (prevState.selectedView !== currState.selectedView) {
      if (!this.parentRef || !this.ref) return;
      return (this.parentRef.scrollTop = this.ref.offsetTop);
    }
  }

  render() {
    return (
      <Collections ref={el => (this.ref = el)}>
        <SegmentedControl>
          {collections.map((collection, i) => (
            <Segment
              key={i}
              onClick={() =>
                this.handleSegmentClick(collection.curatedContentType)
              }
              isActive={
                collection.curatedContentType === this.state.selectedView
              }
            >
              {collection.title}
            </Segment>
          ))}
        </SegmentedControl>

        <CollectionWrapper>
          {collections.map((collection, index) => {
            const communitySlugs = collection.communities;
            return (
              <div key={index}>
                {collection.curatedContentType === this.state.selectedView && (
                  <Category
                    slugs={communitySlugs}
                    curatedContentType={collection.curatedContentType}
                  />
                )}
              </div>
            );
          })}
        </CollectionWrapper>
      </Collections>
    );
  }
}

type CategoryListProps = {
  title: string,
  currentUser?: Object,
  slugs: Array<string>,
  data: {
    communities?: GetCommunitiesType,
  },
  isLoading: boolean,
};
class CategoryList extends React.Component<CategoryListProps> {
  render() {
    const {
      data: { communities },
      title,
      slugs,
      isLoading,
    } = this.props;

    if (communities) {
      let filteredCommunities = communities;
      if (slugs) {
        filteredCommunities = communities.filter(c => {
          if (!c) return null;
          if (slugs.indexOf(c.slug) > -1) return c;
          return null;
        });
      }

      return (
        <ListWithTitle>
          {title ? <ListTitle>{title}</ListTitle> : null}
          <ListWrapper>
            {filteredCommunities.map(
              (community, i) =>
                community && (
                  <ErrorBoundary key={i}>
                    <ProfileCardWrapper>
                      <CommunityProfileCard community={community} />
                    </ProfileCardWrapper>
                  </ErrorBoundary>
                )
            )}
          </ListWrapper>
        </ListWithTitle>
      );
    }

    if (isLoading) {
      return <Loading style={{ padding: '64px 32px', minHeight: '100vh' }} />;
    }

    return <ErrorView />;
  }
}

export const Category = compose(
  withCurrentUser,
  getCommunitiesBySlug,
  viewNetworkHandler,
  connect()
)(CategoryList);
