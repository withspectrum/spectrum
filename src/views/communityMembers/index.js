// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import getCommunityMemberConnection from 'shared/graphql/queries/community/getCommunityMemberConnection';
import type { GetCommunityMemberConnectionType } from 'shared/graphql/queries/community/getCommunityMemberConnection';
import ViewError from '../../components/viewError';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import type { ViewNetworkHandlerType } from '../../components/viewNetworkHandler';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import { CommunityInvitationForm } from '../../components/emailInvitationForm';
import ImportSlack from './components/importSlack';
import CommunityMembers from './components/communityMembers';
import {
  SectionsContainer,
  SectionCard,
  SectionTitle,
  Column,
} from '../../components/settingsViews/style';
import { Loading } from '../../components/loading';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  currentUser: Object,
  data: {
    community: GetCommunityMemberConnectionType,
  },
  id: string,
  dispatch: Function,
  match: Object,
  history: Object,
};

class CommunityMembersSettings extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading, history } = this.props;

    if (community && community.id) {
      return (
        <SectionsContainer>
          <Column>
            <CommunityMembers
              history={history}
              id={community.id}
              community={community}
            />
          </Column>

          <Column>
            <ImportSlack community={community} id={community.id} />
            <SectionCard>
              <SectionTitle>Invite by email</SectionTitle>
              <CommunityInvitationForm id={community.id} />
            </SectionCard>
          </Column>
        </SectionsContainer>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <ViewError
        heading={'You don’t have permission to manage this community.'}
        subheading={
          'If you want to create your own community, you can get started below.'
        }
      >
        <ButtonRow>
          <Link to={'/'}>
            <OutlineButton large>Take me back</OutlineButton>
          </Link>

          <Link to={'/new/community'}>
            <Button large>Create a community</Button>
          </Link>
        </ButtonRow>
      </ViewError>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  getCommunityMemberConnection,
  viewNetworkHandler
)(CommunityMembersSettings);
