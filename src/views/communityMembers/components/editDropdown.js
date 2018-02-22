// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import {
  EditDropdownContainer,
  Dropdown,
  DropdownSectionDivider,
  DropdownSection,
  DropdownSectionSubtitle,
  DropdownSectionCardInfo,
  DropdownSectionText,
  DropdownSectionTitle,
  DropdownAction,
} from '../../../components/settingsViews/style';
import Icon from '../../../components/icons';
import { Spinner } from '../../../components/globals';
import { openModal } from 'src/actions/modals';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import OutsideClickHandler from '../../../components/outsideClickHandler';
import addCommunityModerator from 'shared/graphql/mutations/communityMember/addCommunityModerator';
import removeCommunityModerator from 'shared/graphql/mutations/communityMember/removeCommunityModerator';
import blockCommunityMember from 'shared/graphql/mutations/communityMember/blockCommunityMember';
import unblockCommunityMember from 'shared/graphql/mutations/communityMember/unblockCommunityMember';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';
import MutationWrapper from './mutationWrapper';
import { getCardImage } from '../../communityBilling/utils';

type Props = {
  blockCommunityMember: Function,
  unblockCommunityMember: Function,
  addCommunityModerator: Function,
  removeCommunityModerator: Function,
  dispatch: Function,
  community: GetCommunitySettingsType,
  history: Object,
  user: {
    ...$Exact<GetUserType>,
  },
  permissions: {
    isMember: boolean,
    isBlocked: boolean,
    isModerator: boolean,
    isOwner: boolean,
  },
};

type State = { isOpen: boolean };

class EditDropdown extends React.Component<Props, State> {
  initialState = { isOpen: false };

  state = this.initialState;

  input = {
    communityId: this.props.community.id,
    userId: this.props.user.id,
  };

  permissionConfigurations = {
    owner: {
      id: 'owner',
      title: 'Owner',
      subtitle: 'Can manage all members, moderators, channels, and content',
      selected: false,
    },
    moderator: {
      id: 'moderator',
      title: this.props.community.hasChargeableSource
        ? 'Moderator · $10/mo'
        : 'Moderator',
      subtitle: 'Can edit and delete conversations',
      selected: false,
    },
    blocked: {
      id: 'blocked',
      title: 'Blocked',
      subtitle:
        'Can not start or join conversations, and will not receive any notifications about community activity',
      selected: false,
    },
    member: {
      id: 'member',
      title: 'Member',
      subtitle:
        "Can start new conversations and reply to anyone else's conversations",
      selected: false,
    },
  };

  initMessage = () => {
    this.props.dispatch(initNewThreadWithUser(this.props.user));
    return this.props.history.push('/messages/new');
  };

  getRolesConfiguration = () => {
    const { permissions, community } = this.props;

    if (permissions.isOwner) {
      return [
        {
          ...this.permissionConfigurations.owner,
          selected: true,
        },
      ];
    }

    if (permissions.isModerator) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: null,
          selected: true,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: this.props.removeCommunityModerator,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: this.props.blockCommunityMember,
        },
      ];
    }

    if (permissions.isMember) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: community.hasChargeableSource
            ? this.props.addCommunityModerator
            : null,
          onClick: this.initUpgrade,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: null,
          selected: true,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: this.props.blockCommunityMember,
        },
      ];
    }

    if (permissions.isBlocked) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: community.hasChargeableSource
            ? this.props.addCommunityModerator
            : null,
          onClick: this.initUpgrade,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: this.props.unblockCommunityMember,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: null,
          selected: true,
        },
      ];
    }
  };

  toggleOpen = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  initUpgrade = () => {
    return this.props.dispatch(
      openModal('UPGRADE_MODERATOR_SEAT_MODAL', {
        input: this.input,
        community: this.props.community,
      })
    );
  };

  getDefaultCardInfo = () => {
    const { community } = this.props;
    const sources = community.billingSettings.sources;
    if (!sources || sources.length === 0) return null;
    const defaultSource = sources.find(source => source.isDefault);
    if (!defaultSource) return null;
    return (
      <DropdownSectionCardInfo>
        <img src={getCardImage(defaultSource.card.brand)} width={24} />
        <span>
          Pay with {defaultSource.card.brand} ending in{' '}
          {defaultSource.card.last4}
        </span>
      </DropdownSectionCardInfo>
    );
  };

  render() {
    const { isOpen } = this.state;
    const configuration = this.getRolesConfiguration();

    return (
      <EditDropdownContainer>
        <Icon onClick={this.toggleOpen} isOpen={isOpen} glyph={'settings'} />

        {isOpen && (
          <OutsideClickHandler onOutsideClick={this.close}>
            <Dropdown>
              <DropdownSection
                style={{ borderBottom: '0' }}
                onClick={this.initMessage}
              >
                <DropdownAction>
                  <Icon glyph={'message'} size={'32'} />
                </DropdownAction>
                <DropdownSectionText>
                  <DropdownSectionTitle>
                    Send Direct Message
                  </DropdownSectionTitle>
                </DropdownSectionText>
              </DropdownSection>

              <DropdownSectionDivider />

              {configuration &&
                configuration.map((role, i) => {
                  return role.mutation ? (
                    <MutationWrapper
                      key={i}
                      mutation={role.mutation && role.mutation}
                      variables={{ input: this.input }}
                      render={({ isLoading }) => (
                        <DropdownSection>
                          <DropdownAction>
                            {isLoading ? (
                              <Spinner size={20} />
                            ) : (
                              <Icon
                                glyph={role.selected ? 'checkmark' : 'checkbox'}
                                size={'32'}
                              />
                            )}
                          </DropdownAction>

                          <DropdownSectionText>
                            <DropdownSectionTitle>
                              {role.title}
                            </DropdownSectionTitle>
                            <DropdownSectionSubtitle>
                              {role.subtitle}
                            </DropdownSectionSubtitle>

                            {role.id === 'moderator' &&
                              this.getDefaultCardInfo()}
                          </DropdownSectionText>
                        </DropdownSection>
                      )}
                    />
                  ) : (
                    <DropdownSection key={i} onClick={role.onClick}>
                      <DropdownAction>
                        <Icon
                          glyph={role.selected ? 'checkmark' : 'checkbox'}
                          size={'32'}
                        />
                      </DropdownAction>

                      <DropdownSectionText>
                        <DropdownSectionTitle>
                          {role.title}
                        </DropdownSectionTitle>
                        <DropdownSectionSubtitle>
                          {role.subtitle}
                        </DropdownSectionSubtitle>

                        {role.id === 'moderator' && this.getDefaultCardInfo()}
                      </DropdownSectionText>
                    </DropdownSection>
                  );
                })}
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
  addCommunityModerator,
  removeCommunityModerator,
  blockCommunityMember,
  unblockCommunityMember
)(EditDropdown);
