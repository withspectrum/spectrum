// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import ViewError from '../../components/viewError';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import { CommunityInvitationForm } from '../../components/emailInvitationForm';
import SlackConnection from '../communitySettings/components/slack';
import CommunityMembers from './components/communityMembers';
import JoinTokenSettings from './components/joinTokenSettings';
import type { Dispatch } from 'redux';
import {
  SectionsContainer,
  SectionCard,
  SectionTitle,
  Column,
} from '../../components/settingsViews/style';

type Props = {
  currentUser: Object,
  community: GetCommunityType,
  dispatch: Dispatch<Object>,
  match: Object,
  history: Object,
};

class CommunityMembersSettings extends React.Component<Props> {
  render() {
    const { community, history } = this.props;

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
            <SlackConnection type={'import-only'} id={community.id} />
            {community.isPrivate && (
              <JoinTokenSettings id={community.id} community={community} />
            )}
            <SectionCard>
              <SectionTitle>Invite by email</SectionTitle>
              <CommunityInvitationForm id={community.id} />
            </SectionCard>
          </Column>
        </SectionsContainer>
      );
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
  connect(map)
)(CommunityMembersSettings);
