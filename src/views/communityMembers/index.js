// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import CommunityMembers from './components/communityMembers';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { SectionsContainer, Column } from 'src/components/settingsViews/style';
import { ErrorBoundary, SettingsFallback } from 'src/components/error';
import { ErrorView } from 'src/views/viewHelpers';

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
            <ErrorBoundary fallbackComponent={SettingsFallback}>
              <CommunityMembers
                history={history}
                id={community.id}
                community={community}
              />
            </ErrorBoundary>
          </Column>
        </SectionsContainer>
      );
    }

    return <ErrorView />;
  }
}

export default compose(
  withCurrentUser,
  connect()
)(CommunityMembersSettings);
