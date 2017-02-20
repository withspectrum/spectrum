import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  Column,
  Header,
  ScrollBody,
  JoinBtn,
  LoginWrapper,
  LoginText,
  LoginButton,
  HiddenInput,
  TipButton,
  Overlay
} from './style';
import {
  toggleComposer
} from '../../../actions/composer';
import {
  toggleFrequencyPrivacy,
  unsubscribeFrequency,
  subscribeFrequency
} from '../../../actions/frequencies';
import {
  login,
} from '../../../actions/user';
import { getFrequencyPermission, getCurrentFrequency } from '../../../helpers/frequencies';
import { Lock, Unlock, NewPost, ClosePost } from '../../../shared/Icons';
import StoryCard from '../StoryCard';
import ShareCard from '../ShareCard';

class StoryMaster extends Component {
  toggleComposer = () => {
    this.props.dispatch(toggleComposer());
  };

  togglePrivacy = () => {
    this.props.dispatch(toggleFrequencyPrivacy());
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency());
  };

  subscribeFrequency = () => {
    this.props.dispatch(subscribeFrequency());
  };

  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  sortArrayByKey = (array, key) => {
    return array.sort((a, b) => {
      let x = a[key];
      let y = b[key];

      return x < y ? -1 : x > y ? 1 : 0;
    });
  };

  render() {
    const { user, stories, frequencies, composer } = this.props;
    let sortedStories = this.sortArrayByKey(stories.stories, 'timestamp');

    if (frequencies.active !== 'all') {
      sortedStories = sortedStories.filter(
        story => story.frequency === frequencies.active,
      );
    }

    let urlBase = frequencies.active === 'all' ? 'all' : frequencies.active;
    let usersPermissionOnFrequency = getFrequencyPermission(
      user,
      frequencies.active,
      frequencies.frequencies,
    );
    const currentFrequency = getCurrentFrequency(
      frequencies.active,
      frequencies.frequencies,
    );
    const currentFrequencyPrivacy = currentFrequency
      ? currentFrequency.settings.private
      : '';

    let subscribeButton = (usersFrequencies, activeFrequency) => {
      let keys = Object.keys(usersFrequencies);

      if (usersPermissionOnFrequency === 'owner') {
        return;
      } else if (
        currentFrequencyPrivacy && usersPermissionOnFrequency === undefined
      ) {
        return;
      } else if (
        !usersFrequencies &&
        activeFrequency !== 'all' &&
        activeFrequency !== null
      ) {
        return <JoinBtn onClick={this.subscribeFrequency}>Join</JoinBtn>;
      } else if (activeFrequency === 'all' || activeFrequency === null) {
        return '';
      } else if (keys.indexOf(activeFrequency) > -1) {
        return (
          <JoinBtn member onClick={this.unsubscribeFrequency}>Leave</JoinBtn>
        );
      } else if (!activeFrequency) {
        return '';
      } else {
        return <JoinBtn onClick={this.subscribeFrequency}>Join</JoinBtn>;
      }
    };

    let addStoryButton = (usersFrequencies, activeFrequency) => {
      let keys = Object.keys(usersFrequencies);

      if (!usersFrequencies) {
        return '';
      } else if (keys.indexOf(activeFrequency) > -1) {
        return (
          <TipButton
            onClick={this.toggleComposer}
            tipText="New Story"
            tipLocation="bottom"
          >
            {composer.isOpen
              ? <ClosePost color="warn" />
              : <NewPost color="brand" stayActive />}
          </TipButton>
        );
      } else if (activeFrequency === 'all') {
        return (
          <TipButton
            onClick={this.toggleComposer}
            tipText="New Story"
            tipLocation="bottom"
          >
            {composer.isOpen
              ? <ClosePost color="warn" />
              : <NewPost color="brand" stayActive />}
          </TipButton>
        );
      } else {
        return '';
      }
    };

    const canViewStories = () => {
      if (currentFrequencyPrivacy && usersPermissionOnFrequency !== undefined) {
        return true;
      } else if (
        currentFrequencyPrivacy && usersPermissionOnFrequency === undefined
      ) {
        return false;
      } else {
        return true;
      }
    };
    const canView = canViewStories();

    const getPrivacyButton = usersPermissionOnFrequency => {
      switch (usersPermissionOnFrequency) {
        case 'owner':
          return (
            <label>
              {currentFrequencyPrivacy ? <Lock /> : <Unlock />}
              <HiddenInput
                type="checkbox"
                checked={currentFrequencyPrivacy}
                onChange={this.togglePrivacy}
              />
            </label>
          );
        case 'subscriber':
          return;
        default:
          return;
      }
    };

    const privacyButton = getPrivacyButton(usersPermissionOnFrequency);

    if (canView) {
      return (
        <Column>

          {this.props.user.uid &&
            <Header>
              {addStoryButton(
                this.props.user.frequencies,
                this.props.frequencies.active,
              )}
              {subscribeButton(
                this.props.user.frequencies,
                this.props.frequencies.active,
              )}
              {frequencies.active === 'all' ? '' : privacyButton}
            </Header>}

          <ScrollBody>
            <Overlay active={composer.isOpen} />
            {!this.props.user.uid /* if a user doesn't exist, show a login at the top of the story master */ &&
              <LoginWrapper onClick={this.login}>
                <LoginText>Sign in to join the conversation.</LoginText>
                <LoginButton>Sign in with Twitter</LoginButton>
              </LoginWrapper>}

            {stories.stories.length > 0 &&
              // slice and reverse makes sure our stories show up in revers chron order
              sortedStories.slice().reverse().map((story, i) => {
                return (
                  <Link to={`/${urlBase}/${story.id}`} key={i}>
                    <StoryCard data={story} key={i} />
                  </Link>
                );
              })}

            {currentFrequency &&
              frequencies.active &&
              frequencies.active !== 'all'
              ? <ShareCard data={currentFrequency} />
              : ''}

            {this.props.user.uid &&
              <NewPost onClick={this.toggleComposer} tooltip={'New Story'} />}
          </ScrollBody>
        </Column>
      );
    } else {
      return <Lock />;
    }
  }
}

const mapStateToProps = state => {
  return {
    stories: state.stories,
    frequencies: state.frequencies,
    composer: state.composer,
    user: state.user,
  };
};

export default connect(mapStateToProps)(StoryMaster);
