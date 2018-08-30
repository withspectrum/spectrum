// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import {
  getCommunityById,
  type GetCommunityType,
} from 'shared/graphql/queries/community/getCommunity';
import { Loading } from 'src/components/loading';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { Button } from 'src/components/buttons';
import saveBrandedLoginSettings from 'shared/graphql/mutations/community/saveBrandedLoginSettings';
import type { Dispatch } from 'redux';
import { openModal } from '../../../../actions/modals';

type Props = {
  data: {
    community: GetCommunityType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  dispatch: Dispatch<Object>,
};

type State = {
  messageValue: ?string,
  messageLengthError: boolean,
  isLoading: boolean,
};

class TransferOwnership extends React.Component<Props, State> {
  state = {
    messageValue: null,
    messageLengthError: false,
    isLoading: false,
  };

  render() {
    const {
      data: { community },
      isLoading,
      dispatch,
    } = this.props;

    if (community) {
      return (
        <SectionCard data-cy="community-settings-branded-login">
          <SectionTitle>Transfer Ownership</SectionTitle>
          <SectionSubtitle>
            Transfer the ownership of this community to another member. This
            will transfer all of your permissions to the new owner, and they
            will be prompted to setup new billing settings.
          </SectionSubtitle>

          <SectionCardFooter>
            <Button
              gradientTheme={'warn'}
              onClick={() =>
                dispatch(
                  openModal('TRANSFER_OWNERSHIP_MODAL', {
                    community,
                    id: community.id,
                  })
                )
              }
            >
              Transfer Ownership
            </Button>
          </SectionCardFooter>
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(
  getCommunityById,
  viewNetworkHandler,
  saveBrandedLoginSettings,
  connect()
)(TransferOwnership);
