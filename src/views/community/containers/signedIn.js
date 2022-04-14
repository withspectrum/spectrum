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
import { MobileCommunityAction } from 'src/components/titlebar/actions';
import { setTitlebarProps } from 'src/actions/titlebar';
import { CommunityFeeds } from '../components/communityFeeds';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';
import Sidebar from 'src/components/communitySidebar';
import setCommunityLastSeenMutation from 'shared/graphql/mutations/community/setCommunityLastSeen';
import usePrevious from 'src/hooks/usePrevious';
import { FullScreenRedirectView } from 'src/views/viewHelpers/fullScreenRedirect';

type Props = {
  community: CommunityInfoType,
  currentUser: ?UserInfoType,
  dispatch: Dispatch<Object>,
  location: Location,
  setCommunityLastSeen: Function,
};

const Component = (props: Props) => {
  const {
    community,
    currentUser,
    dispatch,
    location,
    setCommunityLastSeen,
  } = props;

  const previousCommunity = usePrevious(community);
  useEffect(() => {
    if (
      !community.id ||
      !currentUser ||
      !community.communityPermissions.isMember
    )
      return;

    if (
      previousCommunity &&
      community &&
      previousCommunity.id !== community.id
    ) {
      setCommunityLastSeen({
        id: previousCommunity.id,
        lastSeen: new Date(),
      });
    }
    if (!previousCommunity && community) {
      setCommunityLastSeen({
        id: community.id,
        lastSeen: new Date(Date.now() + 10000),
      });
    }
  }, [community.id, currentUser]);

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
        rightAction: <MobileCommunityAction community={community} />,
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
        rightAction: <MobileCommunityAction community={community} />,
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
  setCommunityLastSeenMutation,
  connect()
)(Component);
