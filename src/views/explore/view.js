import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import { Transition, zIndex, Shadow, hexa } from '../../components/globals';
import ViewSegment from '../../components/viewSegment';
import { Button } from '../../components/buttons';
import { UpsellSignIn } from '../../components/upsell';
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

export const CommunitySearch = (props: Props) => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    width: 640px;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 0;
    padding: 16px;

    @media (max-width: 640px) {
      margin-top: 80px;
      margin-bottom: 0;
      width: 100%;
    }
  `;

  const PrimaryCTA = styled(Button)`
    padding: 12px 16px;
    font-weight: 700;
    font-size: 14px;
    border-radius: 12px;
    background-color: ${props => props.theme.bg.default};
    background-image: none;
    color: ${props => props.theme.brand.alt};
    transition: ${Transition.hover.off};
    z-index: ${zIndex.card};

    &:hover {
      background-color: ${props => props.theme.bg.default};
      color: ${props => props.theme.brand.default};
      box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.5)};
      transition: ${Transition.hover.on};
    }
  `;

  const SecondaryContent = styled(ThisContent)`
    margin-top: 0;
    margin-bottom: 0;
  `;

  const ThisTagline = styled(Tagline)`margin-bottom: 0;`;

  const SecondaryTagline = styled(ThisTagline)`
    font-size: 20px;
    font-weight: 900;
    margin-top: 0;
    margin-bottom: 2px;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 16px;
    margin-bottom: 16px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: 768px) {
      text-align: left;
    }
  `;

  const isMobile = window.innerWidth < 768;

  const SecondaryCopy = styled(ThisCopy)`margin-bottom: 16px;`;

  return (
    <ViewSegment goop={3} background="constellations">
      <ThisContent>
        <ThisTagline>Find a community for you!</ThisTagline>
        <ThisCopy>
          Try searching for topics like "crypto" or for products like "React"
        </ThisCopy>
        {props.children}
        <SecondaryContent>
          <SecondaryTagline>...or create your own community</SecondaryTagline>
          <SecondaryCopy>
            Building communities on Spectrum is easy and free!
          </SecondaryCopy>
          {props.currentUser ? (
            <Link to={`/new/community`}>
              <PrimaryCTA>Get Started</PrimaryCTA>
            </Link>
          ) : (
            <Link to={`/login?r=${CLIENT_URL}/new/community`}>
              <PrimaryCTA>Get Started</PrimaryCTA>
            </Link>
          )}
        </SecondaryContent>
      </ThisContent>
    </ViewSegment>
  );
};

export const Charts = props => {
  const ChartGrid = styled.div`
    display: flex;
    flex-direction: column;
    flex: auto;
  `;

  return <ChartGrid>{collections && <CollectionSwitcher />}</ChartGrid>;
};

class CollectionSwitcher extends Component {
  constructor() {
    super();

    this.state = {
      selectedView: 'Top Communities',
    };
  }

  handleSegmentClick(title) {
    if (this.state === title) return;

    return this.setState({
      selectedView: title,
    });
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
            selected={this.state.selectedView === 'Top Communities'}
          />
          {collections.map(collection => {
            const { title, categories } = collection;
            return (
              <CategoryWrapper selected={this.state.selectedView === title}>
                {categories.map((category, i) => {
                  return (
                    <Category
                      key={i}
                      title={category.title}
                      slugs={category.communities}
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

class CategoryList extends Component {
  render() {
    const { data: { communities }, title, currentUser } = this.props;

    if (communities) {
      return (
        <ListWithTitle>
          {title ? <ListTitle>{title}</ListTitle> : null}
          <ListWrapper>
            {communities.map((community, i) => (
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

const CategoryWithData = compose(
  getCommunitiesCollectionQuery,
  displayLoadingState
)(CategoryList);
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
export const Category = connect(mapStateToProps)(CategoryWithData);
