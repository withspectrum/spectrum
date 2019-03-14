// @flow
import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import generateMetaInfo from 'shared/generate-meta-info';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Head from 'src/components/head';
import { CommunityProfileCard } from 'src/components/entities';
import { CommunityAvatar } from 'src/components/avatar';
import { MobileCommunityAction } from 'src/components/titlebar/actions';
import { setTitlebarProps } from 'src/actions/titlebar';
import type { SignedInMemberType } from '../types';
import { TeamMembersList } from '../components/teamMembersList';
import { CommunityFeeds } from '../components/communityFeeds';
import { ChannelsList } from '../components/channelsList';
import { SidebarSection } from '../style';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';

const Component = (props: SignedInMemberType) => {
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
          name: community.name,
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

  return (
    <React.Fragment>
      <Head
        title={title}
        description={description}
        image={community.profilePhoto}
      />

      <ViewGrid data-cy="community-view">
        <SecondaryPrimaryColumnGrid>
          <SecondaryColumn>
            <SidebarSection>
              <CommunityProfileCard community={community} />
            </SidebarSection>

            <SidebarSection>
              <ChannelsList id={community.id} communitySlug={community.slug} />
            </SidebarSection>

            <SidebarSection>
              <TeamMembersList
                community={community}
                id={community.id}
                first={100}
                filter={{ isModerator: true, isOwner: true }}
              />
            </SidebarSection>
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
