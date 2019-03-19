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
  DropdownSectionText,
  DropdownSectionTitle,
  DropdownAction,
} from 'src/components/settingsViews/style';
import Icon from 'src/components/icon';
import { Spinner } from 'src/components/globals';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import addCommunityModerator from 'shared/graphql/mutations/communityMember/addCommunityModerator';
import removeCommunityModerator from 'shared/graphql/mutations/communityMember/removeCommunityModerator';
import blockCommunityMember from 'shared/graphql/mutations/communityMember/blockCommunityMember';
import unblockCommunityMember from 'shared/graphql/mutations/communityMember/unblockCommunityMember';
import approvePendingCommunityMember from 'shared/graphql/mutations/communityMember/approvePendingCommunityMember';
import blockPendingCommunityMember from 'shared/graphql/mutations/communityMember/blockPendingCommunityMember';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';
import MutationWrapper from './mutationWrapper';
import type { Dispatch } from 'redux';

type Props = {
  blockCommunityMember: Function,
  unblockCommunityMember: Function,
  addCommunityModerator: Function,
  removeCommunityModerator: Function,
  approvePendingCommunityMember: Function,
  blockPendingCommunityMember: Function,
  dispatch: Function,
  dispatch: Dispatch<Object>,
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
      title: 'Team member',
      subtitle:
        'Highlighted across the community, and can moderate conversations',
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
    approvePendingMember: {
      id: 'approvePending',
      title: 'Approve',
      subtitle: 'Approve this person to join your community',
      selected: false,
    },
    blockPendingMember: {
      id: 'blockPending',
      title: 'Block',
      subtitle:
        'Block this person from joining your community and requesting to join in the future',
      selected: false,
    },
  };

  getRolesConfiguration = () => {
    const { permissions } = this.props;

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
          mutation: this.props.addCommunityModerator,
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
          mutation: this.props.addCommunityModerator,
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

    if (permissions.isPending) {
      return [
        {
          ...this.permissionConfigurations.approvePendingMember,
          mutation: this.props.approvePendingCommunityMember,
        },
        {
          ...this.permissionConfigurations.blockPendingMember,
          mutation: this.props.blockPendingCommunityMember,
        },
      ];
    }
  };

  toggleOpen = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  render() {
    const { user } = this.props;
    const { isOpen } = this.state;
    const configuration = this.getRolesConfiguration();

    return (
      <EditDropdownContainer data-cy="community-settings-member-edit-dropdown-trigger">
        <Icon onClick={this.toggleOpen} isOpen={isOpen} glyph={'settings'} />

        {isOpen && (
          <OutsideClickHandler onOutsideClick={this.close}>
            <Dropdown>
              <InitDirectMessageWrapper
                user={user}
                render={
                  <DropdownSection style={{ borderBottom: '0' }}>
                    <DropdownAction>
                      <Icon glyph={'message-simple-new'} size={'32'} />
                    </DropdownAction>
                    <DropdownSectionText>
                      <DropdownSectionTitle>
                        Send Direct Message
                      </DropdownSectionTitle>
                    </DropdownSectionText>
                  </DropdownSection>
                }
              />

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
  unblockCommunityMember,
  approvePendingCommunityMember,
  blockPendingCommunityMember
)(EditDropdown);
