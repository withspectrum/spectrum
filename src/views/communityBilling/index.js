// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import getCommunityBillingSettings, {
  type GetCommunityBillingSettingsType,
} from 'shared/graphql/queries/community/getCommunityBillingSettings';
import ViewError from '../../components/viewError';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import {
  SectionsContainer,
  Column,
} from '../../components/settingsViews/style';
import CardForm from './components/cardForm';
import AdministratorEmailForm from './components/administratorEmailForm';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from '../../components/viewNetworkHandler';
import { Loading } from '../../components/loading';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  currentUser: Object,
  data: {
    community: GetCommunityBillingSettingsType,
  },
  dispatch: Function,
  match: Object,
  history: Object,
};

class CommunityMembersSettings extends React.Component<Props> {
  render() {
    const { data, isLoading } = this.props;
    const { community } = data;

    if (community && community.id && community.communityPermissions.isOwner) {
      if (!community.billingSettings.administratorEmail) {
        return (
          <SectionsContainer>
            <Column>
              <AdministratorEmailForm community={community} id={community.id} />
            </Column>
          </SectionsContainer>
        );
      }

      return (
        <SectionsContainer>
          <Column>
            <CardForm community={community} />
          </Column>

          <Column />
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
  getCommunityBillingSettings,
  viewNetworkHandler
)(CommunityMembersSettings);
