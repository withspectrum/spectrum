// @flow
import React from 'react';
//$flowignore
import compose from 'recompose/compose';
//$flowignore
import pure from 'recompose/pure';
// $flowignore
import { connect } from 'react-redux';
// $flowignore
import { Link } from 'react-router-dom';
import { getThisCommunity } from './queries';
import { Loading } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import ViewError from '../../components/viewError';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import Titlebar from '../titlebar';
import Header from './components/header';

type Props = {
  match: {
    params: {
      communitySlug: string,
    },
  },
  data: {
    community: {
      name: string,
      profilePhoto: string,
    },
  },
  isLoading: boolean,
  hasError: boolean,
};

type State = {
  timeframe: 'weekly' | 'monthly',
};

class CommunitySettings extends React.Component<Props, State> {
  render() {
    const {
      match: { params: { communitySlug } },
      data: { community },
      isLoading,
      hasError,
    } = this.props;

    if (community) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={`${community.name} analytics`}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />

          <Header community={community} />
        </AppViewWrapper>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={`Community analytics`}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />

        <ViewError
          heading={`You don’t have permission to manage this community.`}
          subheading={`If you want to create your own community, you can get started below.`}
        >
          <ButtonRow>
            <Link to={`/`}>
              <OutlineButton large>Take me back</OutlineButton>
            </Link>

            <Link to={`/new/community`}>
              <Button large>Create a community</Button>
            </Link>
          </ButtonRow>
        </ViewError>
      </AppViewWrapper>
    );
  }
}

export default compose(connect(), getThisCommunity, viewNetworkHandler, pure)(
  CommunitySettings
);
