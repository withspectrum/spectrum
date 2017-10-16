import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { Button } from '../../../../components/buttons';
import { Avatar } from '../../../../components/avatar';
import { saveUserCommunityPermissionsMutation } from '../../../../api/mutations';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { Checkbox } from '../../../../components/formElements';
import {
  Container,
  Row,
  Column,
  Name,
  Username,
  EditForm,
  List,
  Save,
} from './style';

class CommunitySettings extends Component {
  state: {
    isEditing: boolean,
    isLoading: boolean,
    permissions: {
      isOwner: boolean,
      isMember: boolean,
      isBlocked: boolean,
      isModerator: boolean,
      receiveNotifications: boolean,
    },
  };

  constructor(props) {
    super(props);
    const {
      community: {
        communityPermissions: {
          isOwner,
          isMember,
          isBlocked,
          isModerator,
          receiveNotifications,
        },
      },
    } = this.props;

    this.state = {
      isEditing: false,
      isLoading: false,
      permissions: {
        isOwner,
        isMember,
        isBlocked,
        isModerator,
        receiveNotifications,
      },
    };
  }

  initEdit = () => {
    const { isEditing } = this.state;

    if (isEditing) return;

    this.setState({
      isEditing: true,
    });
  };

  save = () => {
    let input = { ...this.state.permissions };
    input['id'] = this.props.community.id;

    this.setState({
      isLoading: true,
    });

    this.props
      .saveUserCommunityPermissions(input)
      .then(({ data: { saveUserCommunityPermissions } }) => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('success', 'Saved'));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        console.log('error', err);
      });
  };

  changePermission = e => {
    const perm = e.target.id;
    const current = this.state.permissions[perm];
    let newState = {};
    newState['permissions'] = { ...this.state.permissions };
    newState['permissions'][perm] = !current;
    this.setState({
      ...newState,
    });
  };

  render() {
    const { community } = this.props;
    const { isEditing, isLoading } = this.state;
    const roles = Object.keys(community.communityPermissions).filter(
      key => community.communityPermissions[key] && key.indexOf('__') === -1
    );
    const role =
      roles.indexOf('isOwner') > -1 ? 'isOwner' : (roles && roles[0]) || '';
    const permissions = Object.keys(this.state.permissions);

    return (
      <Container onClick={this.initEdit}>
        <Row>
          <Avatar size={32} radius={4} src={community.profilePhoto} />
          <Column>
            <Name>{community.name}</Name>
            <Username>{role.substr(2)}</Username>
          </Column>
        </Row>

        {isEditing && (
          <EditForm>
            <List>
              {permissions.map(perm => {
                return (
                  <Checkbox
                    id={perm}
                    checked={this.state.permissions[perm]}
                    onChange={this.changePermission}
                    key={perm}
                  >
                    <span>{perm}</span>
                  </Checkbox>
                );
              })}
            </List>
            <Save>
              <Button onClick={this.save} loading={isLoading}>
                Save
              </Button>
            </Save>
          </EditForm>
        )}
      </Container>
    );
  }
}

export default compose(saveUserCommunityPermissionsMutation, connect(), pure)(
  CommunitySettings
);
