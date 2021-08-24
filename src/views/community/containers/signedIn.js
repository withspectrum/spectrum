// @flow
import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { withRouter, type Location } from 'react-router-dom';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import generateMetaInfo from 'shared/generate-meta-info';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Head from 'src/components/head';
import { CommunityAvatar } from 'src/components/avatar';
import { setTitlebarProps } from 'src/actions/titlebar';
import { CommunityFeeds } from '../components/communityFeeds';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';
import Sidebar from 'src/components/communitySidebar';
import { FullScreenRedirectView } from 'src/views/viewHelpers/fullScreenRedirect';

type Props = {
  community: CommunityInfoType,
  currentUser: ?UserInfoType,
  dispatch: Dispatch<Object>,
  location: Location,
};

const Component = (props: Props) => {
  const { community, dispatch, location } = props;

  const [metaInfo, setMetaInfo] = useState(
    generateMetaInfo({
      type: 'community',
      data: {
        name: community.name,
        description: community.description,
      },
    })
  );

  useEffect(() => {
    setMetaInfo(
      generateMetaInfo({
        type: 'community',
        data: {
          name: `${community.name} community`,
          description: community.description,
        },
      })
    );
    dispatch(
      setTitlebarProps({
        title: community.name,
        titleIcon: (
          <CommunityAvatar
            isClickable={false}
            community={community}
            size={24}
          />
        ),
      })
    );
  }, [community.id]);

  useEffect(() => {
    dispatch(
      setTitlebarProps({
        title: community.name,
        titleIcon: (
          <CommunityAvatar
            isClickable={false}
            community={community}
            size={24}
          />
        ),
      })
    );
  }, [location]);

  const { title, description } = metaInfo;

  if (community.redirect && community.website) {
    return <FullScreenRedirectView community={community} />;
  }

  return (
    <React.Fragment>
      <Head
        title={title}
        description={description}
        image={community.profilePhoto}
      >
        {community.redirect && community.noindex && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </Head>

      <ViewGrid data-cy="community-view">
        <SecondaryPrimaryColumnGrid>
          <SecondaryColumn>
            <Sidebar community={community} />
          </SecondaryColumn>

          <PrimaryColumn>
            <CommunityFeeds community={community} />
          </PrimaryColumn>
        </SecondaryPrimaryColumnGrid>
      </ViewGrid>
    </React.Fragment>
  );
};

export const SignedIn = compose(
  withCurrentUser,
  withRouter,
  connect()
)(Component);
