// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Head from 'src/components/head';
import {
  CommunityProfileCard,
  MobileCommunityProfileCard,
} from 'src/components/Entities';
import type { SignedInMemberType } from '../types';
import { TeamMembersList } from '../components/TeamMembersList';
import { CommunityFeeds } from '../components/CommunityFeeds';
import { ChannelsList } from '../components/ChannelsList';
import { Main, Sidebar, SidebarSection } from '../style';
import {
  ViewGrid,
  PrimarySecondaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/Layout';

const Component = (props: SignedInMemberType) => {
  const { community } = props;

  let containerEl = null;

  useEffect(() => {
    containerEl = document.getElementById('scroller-for-thread-feed');
  }, []);

  const { title, description } = generateMetaInfo({
    type: 'community',
    data: {
      name: community.name,
      description: community.description,
    },
  });

  const scrollToTop = () => {
    if (containerEl) return containerEl.scrollTo(0, 0);
  };

  const scrollToBottom = () => {
    if (containerEl) {
      containerEl.scrollTop =
        containerEl.scrollHeight - containerEl.clientHeight;
    }
  };

  const scrollToPosition = (position: number) => {
    if (containerEl) {
      containerEl.scrollTop = position;
    }
  };

  const contextualScrollToBottom = () => {
    if (
      containerEl &&
      containerEl.scrollHeight - containerEl.clientHeight <
        containerEl.scrollTop + 280
    ) {
      scrollToBottom();
    }
  };

  return (
    <React.Fragment>
      <Head
        title={title}
        description={description}
        image={community.profilePhoto}
      />

      <ViewGrid data-cy="community-view">
        <PrimarySecondaryColumnGrid>
          <PrimaryColumn>
            <MobileCommunityProfileCard community={community} />

            <CommunityFeeds
              scrollToBottom={scrollToBottom}
              contextualScrollToBottom={contextualScrollToBottom}
              scrollToTop={scrollToTop}
              scrollToPosition={scrollToPosition}
              community={community}
            />
          </PrimaryColumn>

          <SecondaryColumn>
            <CommunityProfileCard community={community} />

            <SidebarSection>
              <TeamMembersList
                community={community}
                id={community.id}
                first={100}
                filter={{ isModerator: true, isOwner: true }}
              />
            </SidebarSection>

            <SidebarSection>
              <ChannelsList id={community.id} communitySlug={community.slug} />
            </SidebarSection>
          </SecondaryColumn>
        </PrimarySecondaryColumnGrid>
      </ViewGrid>
    </React.Fragment>
  );
};

export const SignedIn = compose(
  withCurrentUser,
  connect()
)(Component);
