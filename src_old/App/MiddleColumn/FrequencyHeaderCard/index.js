import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../../shared/Card';
import { Button, TextButton, IconButton } from '../../../shared/Globals';
import Icon from '../../../shared/Icons';
import { Actions, Body, Title, Description, Count } from './style';
import { toggleComposer } from '../../../actions/composer';
import { openModal } from '../../../actions/modals';
import { login } from '../../../actions/user';
import { getPermission } from '../../../helpers/permissions';
import {
  unsubscribeFrequency,
  subscribeFrequency,
  setActiveFrequency,
} from '../../../actions/frequencies';

class FrequencyHeaderCard extends Component {
  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  toggleComposer = () => {
    this.props.dispatch(toggleComposer());
  };

  editFrequency = () => {
    const { frequencies: { frequencies, active } } = this.props;
    const activeFrequency = frequencies.find(
      frequency => frequency.slug === active
    );

    this.props.dispatch(openModal('FREQUENCY_EDIT_MODAL', activeFrequency));
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.frequencies.active));
  };

  subscribeFrequency = () => {
    this.props.dispatch(
      subscribeFrequency({
        frequencySlug: this.props.frequencies.active,
        communitySlug: this.props.communities.active,
      })
    );
  };

  frequencyActions = () => {
    const {
      user,
      frequencies: { frequencies, active },
      communities,
    } = this.props;
    const currentUser = user;
    const activeFrequency = frequencies.find(
      frequency => frequency.slug === active
    );
    const activeCommunity = communities.communities.find(
      community => community.slug === communities.active
    );

    const frequencyRole =
      currentUser.uid &&
      activeFrequency &&
      getPermission(currentUser.uid, activeFrequency);

    const communityRole =
      currentUser.uid &&
      activeCommunity &&
      getPermission(currentUser.uid, activeCommunity);

    if (!user.uid) {
      return (
        <Actions>
          <Button width={'100%'} onClick={this.login}>
            {`Sign in with Twitter to Chat!`}
          </Button>
        </Actions>
      );
    }

    if (
      (communityRole === 'owner' && frequencyRole) || frequencyRole === 'owner'
    ) {
      return (
        <Actions>
          <IconButton onClick={this.editFrequency}>
            <Icon
              icon="settings"
              subtle
              tipText="Frequency Settings"
              tipLocation="right"
            />
          </IconButton>

          <Button onClick={this.toggleComposer}>
            New Post
          </Button>
        </Actions>
      );
    }

    if (frequencyRole === 'subscriber') {
      return (
        <Actions>
          <TextButton onClick={this.unsubscribeFrequency}>
            {`Leave ~${activeFrequency.name}`}
          </TextButton>

          <Button onClick={this.toggleComposer}>
            New Post
          </Button>
        </Actions>
      );
    }

    if (communityRole === 'owner' && !frequencyRole) {
      return (
        <Actions>
          <IconButton onClick={this.editFrequency}>
            <Icon
              icon="settings"
              subtle
              tipText="Frequency Settings"
              tipLocation="right"
            />
          </IconButton>

          <Button onClick={this.subscribeFrequency}>
            {`Follow ~${activeFrequency.name}`}
          </Button>
        </Actions>
      );
    }

    return (
      <Actions>
        <Button width={'100%'} onClick={this.subscribeFrequency}>
          {`Follow ~${activeFrequency.name}`}
        </Button>
      </Actions>
    );
  };

  render() {
    const { frequencies: { frequencies, active } } = this.props;
    const activeFrequency = frequencies.find(
      frequency => frequency.slug === active
    );

    return (
      <Card static>
        <Body>
          <Title>~{activeFrequency.name}</Title>
          <Count>
            {Object.keys(activeFrequency.users).length} followers
          </Count>
          <Description>
            {activeFrequency.description}
          </Description>

          {this.frequencyActions()}
        </Body>
      </Card>
    );
  }
}

const mapStateToProps = (state: Object) => ({
  communities: state.communities,
  frequencies: state.frequencies,
  user: state.user,
});
export default connect(mapStateToProps)(FrequencyHeaderCard);
