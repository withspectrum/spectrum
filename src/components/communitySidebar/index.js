// @flow
import React from 'react';
import { SidebarSection } from 'src/views/community/style';
import { TeamMembersList } from 'src/views/community/components/teamMembersList';
import { ChannelsList } from 'src/views/community/components/channelsList';
import { CommunityProfileCard } from 'src/components/entities';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  community: Object,
};

export default ({ community }: Props) => (
  <React.Fragment>
    <SidebarSection>
      <CommunityProfileCard community={community} />
    </SidebarSection>

    <ErrorBoundary>
      <SidebarSection>
        <ChannelsList id={community.id} communitySlug={community.slug} />
      </SidebarSection>
    </ErrorBoundary>

    <ErrorBoundary>
      <SidebarSection>
        <TeamMembersList
          community={community}
          id={community.id}
          first={100}
          filter={{ isModerator: true, isOwner: true }}
        />
      </SidebarSection>
    </ErrorBoundary>
  </React.Fragment>
);
