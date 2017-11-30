// @flow
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import compose from 'recompose/compose';
import { Transition, zIndex, Shadow, hexa } from '../../components/globals';
import ViewSegment from '../../components/viewSegment';
import { Button } from '../../components/buttons';
import { CommunityProfile } from '../../components/profile';
import { collections } from './collections';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import {
  ListWithTitle,
  ListTitle,
  ListWrapper,
  CategoryWrapper,
  Collections,
  CollectionWrapper,
  LoadingContainer,
} from './style';
import { CLIENT_URL } from '../../api/constants';
import { getCommunitiesCollectionQuery } from './queries';
import { Loading } from '../../components/loading';
import { SegmentedControl, Segment } from '../../components/segmentedControl';
import { Tagline, Copy, Content } from '../splash/style';

export const Charts = () => {
  const ChartGrid = styled.div`
    display: flex;
    flex-direction: column;
    flex: auto;
  `;

  return <ChartGrid>{collections && <CollectionSwitcher />}</ChartGrid>;
};

type Props = {};
type State = {
  selectedView: string,
};

class CollectionSwitcher extends React.Component<Props, State> {
  state = {
    selectedView: 'top-communities-by-members',
  };

  handleSegmentClick(selectedView) {
    if (this.state.selectedView === selectedView) return;
    return this.setState({ selectedView });
  }

  render() {
    const ThisSegment = styled(Segment)`
      @media (max-width: 768px) {
        &:not(:first-of-type) {
          display: none;
        }
      }
    `;

    return (
      <Collections>
        <SegmentedControl>
          {collections.map((collection, i) => (
            <ThisSegment
              key={i}
              onClick={() =>
                this.handleSegmentClick(collection.curatedContentType)}
              selected={
                collection.curatedContentType === this.state.selectedView
              }
            >
              {collection.title}
            </ThisSegment>
          ))}
        </SegmentedControl>

        <CollectionWrapper>
          {collections.map((collection, index) => {
            const { title, categories } = collection;
            return (
              <CategoryWrapper key={index}>
                {collection.curatedContentType === this.state.selectedView && (
                  <Category
                    categories={collection.categories}
                    curatedContentType={collection.curatedContentType}
                  />
                )}
              </CategoryWrapper>
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
    communities?: Array<Object>,
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
      currentUser,
      categories,
    } = this.props;

    if (communities) {
      let filteredCommunities = communities;
      if (slugs) {
        filteredCommunities = communities.filter(c => {
          if (slugs.indexOf(c.slug) > -1) return c;
          return null;
        });
      }

      if (!categories) {
        return (
          <ListWithTitle>
            {title ? <ListTitle>{title}</ListTitle> : null}
            <ListWrapper>
              {filteredCommunities.map((community, i) => (
                // $FlowFixMe
                <CommunityProfile
                  key={i}
                  profileSize={'upsell'}
                  data={{ community }}
                  currentUser={currentUser}
                />
              ))}
            </ListWrapper>
          </ListWithTitle>
        );
      }

      return (
        <div>
          {categories.map((cat, i) => {
            if (cat.communities) {
              filteredCommunities = communities.filter(c => {
                if (cat.communities.indexOf(c.slug) > -1) return c;
                return null;
              });
            }
            return (
              <ListWithTitle key={i}>
                {cat.title ? <ListTitle>{cat.title}</ListTitle> : null}
                <ListWrapper>
                  {filteredCommunities.map((community, i) => (
                    // $FlowFixMe
                    <CommunityProfile
                      key={i}
                      profileSize={'upsell'}
                      data={{ community }}
                      currentUser={currentUser}
                    />
                  ))}
                </ListWrapper>
              </ListWithTitle>
            );
          })}
        </div>
      );
    }

    if (isLoading) {
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }

    return null;
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export const Category = compose(
  // $FlowIssue
  connect(map),
  getCommunitiesCollectionQuery,
  viewNetworkHandler
)(CategoryList);
