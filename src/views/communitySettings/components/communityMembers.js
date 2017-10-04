import * as React from 'react';
import { UserListItem } from '../../../components/listItems';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { Loading } from '../../../components/loading';
import ViewError from '../../../components/viewError';
import { getCommunityMembersQuery } from '../../../api/community';
import { FetchMoreButton } from '../../../components/threadFeed/style';
import {
  StyledCard,
  ListHeader,
  LargeListHeading,
  ListContainer,
  ListFooter,
} from '../../../components/listItems/style';
import { SectionCard, SectionCardFooter, SectionTitle } from '../style';

type Props = {};
class CommunityMembers extends React.Component<Props> {
  render() {
    const { data: { error, community, networkStatus, fetchMore } } = this.props;
    const members =
      community &&
      community.memberConnection &&
      community.memberConnection.edges.map(member => member.node);
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
                return (
                  <section key={user.id}>
                    <UserListItem user={user} />
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

export default compose(getCommunityMembersQuery, pure)(CommunityMembers);
