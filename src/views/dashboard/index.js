//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';

import {
  getEverythingStories,
  getCurrentUserProfile,
  getCurrentUserCommunities,
} from './queries';
import { displayLoadingState } from '../../components/loading';
import { saveUserDataToLocalStorage } from '../../actions/authentication';

import { Column } from '../../components/column';
import { UserProfile } from '../../components/profile';
import StoryFeed from '../../components/storyFeed';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import { FlexCol, FlexRow } from '../../components/globals';
import { IconButton } from '../../components/buttons';

import {
  StyledCard,
  ListHeading,
  ListContainer,
  ItemWrapper,
  ItemCol,
  ItemRow,
  ItemHeading,
  ItemMeta,
  ItemDescription,
  ActionContainer,
  MoreLink,
} from './style';

const EverythingStoryFeed = compose(getEverythingStories)(StoryFeed);

const CurrentUserProfile = compose(getCurrentUserProfile)(UserProfile);

const CommunitiesList = ({ data: { communities } }) => {
  return (
    <StyledCard>
      <ListHeading>My Communities</ListHeading>
      <ListContainer>
        {communities.map(item => {
          return (
            <ListCardItem
              key={item.node.id}
              contents={item.node}
              withDescription={false}
              meta={`${item.node.metaData.members} members · ${item.node.metaData.frequencies} frequencies`}
            >
              <IconButton
                icon="forward"
                iconColor={'text.alt'}
                iconHoverColor={'brand.alt'}
                scaleOnHover={true}
              />
            </ListCardItem>
          );
        })}
      </ListContainer>
      <FlexRow>
        <MoreLink to={`/explore`}>Find More</MoreLink>
      </FlexRow>
    </StyledCard>
  );
};

type CardProps = {
  contents: {
    name: string,
    description?: string,
  },
  children?: React$Element<any>,
  meta?: string,
};

const ListCardItem = (props: CardProps): React$Element<any> => {
  return (
    <ItemWrapper>
      <ItemRow>
        <ItemCol>
          <ItemHeading>{props.contents.name}</ItemHeading>
          <ItemMeta>{props.meta}</ItemMeta>
        </ItemCol>
        <ActionContainer>{props.children}</ActionContainer>
      </ItemRow>
      {!!props.contents.description && props.withDescription
        ? <ItemDescription>{props.contents.description}</ItemDescription>
        : ''}
    </ItemWrapper>
  );
};

const CommunitiesListCard = compose(
  getCurrentUserCommunities,
  displayLoadingState
)(CommunitiesList);

const DashboardPure = ({ data: { user }, dispatch }) => {
  // save user data to localstorage, which will also dispatch an action to put
  // the user into the redux store
  if (user) {
    dispatch(saveUserDataToLocalStorage(user));
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <CurrentUserProfile profileSize="full" />
        <CommunitiesListCard />
      </Column>

      <Column type="primary" alignItems="center">
        <StoryComposer />
        <EverythingStoryFeed />
      </Column>
    </AppViewWrapper>
  );
};

/*
  This is bad, but necessary for now!
  I'm wrapping DashboardPure in a query for getCurrentUserProfile so that I
  can store the user in localStorage and redux for any downstream actions
*/
const Dashboard = compose(getCurrentUserProfile, pure)(DashboardPure);
export default connect()(Dashboard);
