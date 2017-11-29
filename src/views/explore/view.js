// @flow
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import compose from 'recompose/compose';
import { Transition, zIndex, Shadow, hexa } from '../../components/globals';
import ViewSegment from '../../components/viewSegment';
import { Button } from '../../components/buttons';
import TopCommunityList from './components/topCommunities';
import { CommunityProfile } from '../../components/profile';
import { collections } from './collections';
import {
  ListWithTitle,
  ListTitle,
  ListWrapper,
  CategoryWrapper,
  Collections,
  CollectionWrapper,
} from './style';
import { CLIENT_URL } from '../../api/constants';
import { getCommunitiesCollectionQuery } from './queries';
import { displayLoadingState } from '../../components/loading';
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
    selectedView: 'Top Communities',
  };

  handleSegmentClick(selectedView) {
    if (this.state.selectedView === selectedView) return;
    return this.setState({ selectedView });
  }

  render() {
    let selectorItems = [];
    selectorItems.push('Top Communities');
    collections.map(collection => {
      selectorItems.push(collection.title);
      return null;
    });

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
          {selectorItems.map((title, i) => (
            <ThisSegment
              key={i}
              onClick={() => this.handleSegmentClick(title)}
              selected={title === this.state.selectedView}
            >
              {title}
            </ThisSegment>
          ))}
        </SegmentedControl>
        <CollectionWrapper>
          <TopCommunityList
            curatedContentType={'top-communities-by-members'}
            selected={this.state.selectedView === 'Top Communities'}
          />
          {collections.map((collection, index) => {
            const { title, categories } = collection;
            return (
              <CategoryWrapper
                key={index}
                selected={this.state.selectedView === title}
              >
                {categories.map((category, i) => {
                  return (
                    <Category
                      key={i}
                      title={category.title}
                      slugs={category.communities}
                      curatedContentType={collection.curatedContentType}
                    />
                  );
                })}
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
};
class CategoryList extends React.Component<CategoryListProps> {
  render() {
    const { data: { communities }, title, slugs, currentUser } = this.props;

    console.log('communities', communities);
    console.log('slugs', slugs);

    if (communities) {
      const filteredCommunities = communities.filter(c => {
        console.log(slugs.indexOf(c.slug));
        if (slugs.indexOf(c.slug) > -1) return c;
        return null;
      });
      return (
        <ListWithTitle>
          {title ? <ListTitle>{title}</ListTitle> : null}
          <ListWrapper>
            {filteredCommunities.map((community, i) => (
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
    } else {
      return null;
    }
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export const Category = compose(
  // $FlowIssue
  connect(map),
  getCommunitiesCollectionQuery,
  displayLoadingState
)(CategoryList);
