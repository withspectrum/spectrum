// @flow
import * as React from 'react';
import { UserListItem } from '../../../components/listItems';
import compose from 'recompose/compose';
import { Loading } from '../../../components/loading';
import ViewError from '../../../components/viewError';
import getCommunityMembersQuery from 'shared/graphql/queries/community/getCommunityMemberConnection';
import { FetchMoreButton } from '../../../components/threadFeed/style';
import { ListContainer } from '../../../components/listItems/style';
import {
  SectionCard,
  SectionCardFooter,
  SectionTitle,
} from '../../../components/settingsViews/style';

type MemberType = {
  node: {
    id: string,
  },
};

type Props = {
  data: {
    error: ?string,
    networkStatus: number,
    fetchMore: Function,
    community: {
      metaData: {
        members: number,
      },
      memberConnection: {
        pageInfo: {
          hasNextPage: boolean,
        },
        edges: Array<?MemberType>,
      },
    },
  },
};
class CommunityMembers extends React.Component<Props> {
  render() {
    const { data: { error, community, networkStatus, fetchMore } } = this.props;
    const members =
      community &&
      community.memberConnection &&
      community.memberConnection.edges.map(member => member && member.node);
    const totalCount =
      community && community.metaData && community.metaData.members;

    if (networkStatus === 1) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    } else if (error) {
      return (
        <SectionCard>
          <ViewError small />
        </SectionCard>
      );
    } else {
      return (
        <SectionCard>
          <SectionTitle>{totalCount.toLocaleString()} Members</SectionTitle>

          <ListContainer>
            {members &&
              members.map(user => {
                if (!user) return;
                return (
                  <section key={user.id}>
                    <UserListItem
                      user={user}
                      reputationTipText={'Rep in this community'}
                    />
                  </section>
                );
              })}
          </ListContainer>

          {community.memberConnection.pageInfo.hasNextPage && (
            <SectionCardFooter>
              <FetchMoreButton
                color={'brand.default'}
                loading={networkStatus === 3}
                onClick={() => fetchMore()}
              >
                Load more
              </FetchMoreButton>
            </SectionCardFooter>
          )}
        </SectionCard>
      );
    }
  }
}

export default compose(getCommunityMembersQuery)(CommunityMembers);
