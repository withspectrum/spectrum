import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import { Transition, zIndex, Shadow, hexa } from '../../components/globals';
import ViewSegment from '../../components/viewSegment';
import { Button } from '../../components/buttons';
import Search from './components/search';
import { UpsellSignIn } from '../../components/upsell';
import TopCommunityList from './components/topCommunities';
import { CommunityProfile } from '../../components/profile';
import { collections } from './collections';
import { ListWithTitle, ListTitle, ListWrapper, ListItem } from './style';
import { getCommunitiesCollectionQuery } from './queries';
import { displayLoadingState } from '../../components/loading';
import {
  Header,
  Tagline,
  Copy,
  Bullets,
  Bullet,
  BulletHeading,
  BulletTitle,
  BulletCopy,
  LinkBlock,
  Footer,
  Flexer,
  PrimaryCTA,
  SecondaryCTA,
  Content,
} from '../splash/style';

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
    margin-bottom: 2px;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 16px;
    margin-bottom: 32px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: 768px) {
      text-align: left;
    }
  `;

  const SecondaryCopy = styled(ThisCopy)`margin-bottom: 16px;`;

  return (
    <ViewSegment goop={3} background="constellations">
      <ThisContent>
        <ThisTagline>Find a community for you!</ThisTagline>
        <ThisCopy>
          Try searching for topics like "crypto" or for products like "React"
        </ThisCopy>
        {props.children}
        {!props.currentUser ? (
          <UpsellSignIn redirectPath={props.redirectPath} />
        ) : (
          <SecondaryContent>
            <SecondaryTagline>...or create your own community</SecondaryTagline>
            <SecondaryCopy>
              Building communities on Spectrum is easy and free!
            </SecondaryCopy>
            <Link to={`/new/community`}>
              <PrimaryCTA>Get Started</PrimaryCTA>
            </Link>
          </SecondaryContent>
        )}
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

  const Featured = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 32px;

    @media (max-width: 768px) {
      padding: 0;
    }
  `;

  const Collections = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const CollectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 32px;

    @media (max-width: 768px) {
      padding: 0;

      h1 {
        margin-top: 32px;
        margin-left: 16px;
      }
    }
  `;

  const CategoryWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  `;

  return (
    <ChartGrid>
      <Featured>
        <TopCommunityList withMeta={true} withDescription={false} />
      </Featured>
      {collections && (
        <Collections>
          {collections.map(collection => {
            const { title, categories } = collection;
            return (
              <CollectionWrapper>
                <h1>{title}</h1>
                <CategoryWrapper>
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
              </CollectionWrapper>
            );
          })}
        </Collections>
      )}
    </ChartGrid>
  );
};

class CategoryList extends Component {
  render() {
    const {
      data: { communities },
      data,
      title,
      slugs,
      currentUser,
    } = this.props;

    if (communities) {
      return (
        <ListWithTitle>
          {title ? <ListTitle>{title}</ListTitle> : null}
          <ListWrapper>
            {communities.map(community => (
              <ListItem>
                <CommunityProfile
                  profileSize={'listItemWithAction'}
                  data={{ community }}
                  currentUser={currentUser}
                />
              </ListItem>
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
