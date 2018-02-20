// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  EditDropdownContainer,
  Dropdown,
  DropdownSection,
  DropdownSectionSubtitle,
  DropdownSectionText,
  DropdownSectionTitle,
  DropdownAction,
} from '../../../components/settingsViews/style';
import Icon from '../../../components/icons';
import { Spinner } from '../../../components/globals';
import OutsideClickHandler from '../../../components/outsideClickHandler';
import MutationWrapper from './mutationWrapper';
import removePaymentSource from 'shared/graphql/mutations/community/removePaymentSource';
import makeDefaultPaymentSource from 'shared/graphql/mutations/community/makeDefaultPaymentSource';
import type { GetCommunityBillingSettingsType } from 'shared/graphql/queries/community/getCommunityBillingSettings';

type Props = {
  removePaymentSource: Function,
  makeDefaultPaymentSource: Function,
  dispatch: Function,
  community: GetCommunityBillingSettingsType,
  source: {
    id: string,
    isDefault: boolean,
    card: {
      brand: string,
      last4: string,
      exp_month: number,
      exp_year: number,
    },
  },
  history: Object,
  isLastSource: boolean,
};

type State = { isOpen: boolean };

class EditDropdown extends React.Component<Props, State> {
  initialState = { isOpen: false };

  state = this.initialState;

  input = {
    communityId: this.props.community.id,
    sourceId: this.props.source.id,
  };

  toggleOpen = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  render() {
    const { isOpen } = this.state;
    const {
      makeDefaultPaymentSource,
      removePaymentSource,
      source,
      isLastSource,
    } = this.props;

    return (
      <EditDropdownContainer>
        <Icon onClick={this.toggleOpen} isOpen={isOpen} glyph={'settings'} />

        {isOpen && (
          <OutsideClickHandler onOutsideClick={this.close}>
            <Dropdown>
              {!source.isDefault && (
                <MutationWrapper
                  key={1}
                  onMutationEnd={this.close}
                  mutation={source.isDefault ? null : makeDefaultPaymentSource}
                  variables={{ input: this.input }}
                  render={({ isLoading }) => (
                    <DropdownSection>
                      <DropdownSectionText>
                        <DropdownSectionTitle>
                          Make default
                        </DropdownSectionTitle>
                        <DropdownSectionSubtitle>
                          Make this the default payment method for future
                          billing events
                        </DropdownSectionSubtitle>
                      </DropdownSectionText>
                      <DropdownAction>
                        {isLoading ? (
                          <Spinner size={20} />
                        ) : (
                          <div style={{ width: '32px', height: '32px' }} />
                        )}
                      </DropdownAction>
                    </DropdownSection>
                  )}
                />
              )}

              <MutationWrapper
                key={2}
                onMutationEnd={this.close}
                mutation={removePaymentSource}
                variables={{ input: this.input }}
                render={({ isLoading }) => (
                  <DropdownSection>
                    <DropdownSectionText>
                      <DropdownSectionTitle>Remove</DropdownSectionTitle>
                      <DropdownSectionSubtitle>
                        {isLastSource
                          ? 'Remove this payment method and cancel all active subscriptions'
                          : `Remove this payment method. ${
                              source.isDefault
                                ? 'The next payment method available will become the new default'
                                : ''
                            }`}
                      </DropdownSectionSubtitle>
                    </DropdownSectionText>
                    <DropdownAction>
                      {isLoading ? (
                        <Spinner size={20} />
                      ) : (
                        <div style={{ width: '32px', height: '32px' }} />
                      )}
                    </DropdownAction>
                  </DropdownSection>
                )}
              />
            </Dropdown>
          </OutsideClickHandler>
        )}
      </EditDropdownContainer>
    );
  }
}

export default compose(
  connect(),
  withRouter,
  makeDefaultPaymentSource,
  removePaymentSource
)(EditDropdown);
