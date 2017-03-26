import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import LeftColumn from './LeftColumn';
import {
  Body,
  LeftColumnContainer,
  MiddleColumnContainer,
  RightColumnContainer,
} from './style';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';
import LoadingIndicator from '../shared/loading';
import ModalRoot from '../shared/modals/ModalRoot';
import SelectUsernameModal from '../shared/modals/SelectUsernameModal';
import GalleryRoot from '../shared/gallery/GalleryRoot';
import NuxJoinCard from './MiddleColumn/NuxJoinCard';
import LoginCard from './MiddleColumn/LoginCard';
import ReportBugCard from './MiddleColumn/ReportBugCard';
import { getCurrentFrequency } from '../helpers/frequencies';
import { sortArrayByKey, getParameterByName, truncate } from '../helpers/utils';
import { ACTIVITY_TYPES } from '../db/types';

class App extends Component {
  state = {
    showDiscoverCard: true, // determines if we should show the NuxJoinCard
    selectModalOpen: true,
  };

  componentWillReceiveProps = nextProps => {
    this.setState({
      showDiscoverCard: Object.keys(nextProps.user.frequencies).length > 10
        ? false
        : true,
    });
  };

  closeSelectModal = () => {
    this.setState({
      selectModalOpen: false,
    });
  };

  render() {
    const { stories, frequencies, user, ui, notifications } = this.props;
    const frequency = getCurrentFrequency(
      frequencies.active,
      frequencies.frequencies,
    );

    const isEverything = frequencies.active === 'everything';

    let sortedStories = sortArrayByKey(
      stories.stories.slice(),
      'last_activity',
      'timestamp',
    )
      .reverse()
      .filter(story => !story.deleted);

    if (frequency && !frequency.active !== 'everything') {
      sortedStories = sortedStories.filter(story => {
        return story.frequencyId === frequency.id && story.published;
      });
    }

    const titleParam = getParameterByName('t', this.props.location.search);
    const descriptionParam = getParameterByName(
      'd',
      this.props.location.search,
    );

    let title = titleParam;
    let description = descriptionParam;

    if (!title && !description) {
      const story = sortedStories.find(story => story.id === stories.active);
      const freq = (frequency || story) &&
        getCurrentFrequency(story.frequencyId, frequencies.frequencies);

      if (!(story && story.content) && !(freq && freq.name)) {
        title = 'Spectrum';
        description = 'Like a forum but for Mars colonists.';
      } else {
        title = `${story && story.content
          ? `${truncate(story.content.title, 40)} `
          : ''}${freq ? `~${freq.name} ` : ''}${story && story.content || freq
          ? '· '
          : ''}Spectrum`;
        description = story && story.content
          ? `${story.content.description
              ? truncate(story.content.description, 150)
              : 'A story on Spectrum'}`
          : freq ? freq.description : 'Like a forum but for Mars colonists.';
      }
    }

    const unread = notifications.notifications.reduce(
      (sum, notification) => {
        if (notification.activityType !== ACTIVITY_TYPES.NEW_MESSAGE)
          return sum;
        const story = stories.stories.find(
          story => story.id === notification.ids.story,
        );
        if (!story || story.deleted) return sum;
        return sum + notification.unread;
      },
      0,
    );

    if (unread > 0) title = `(${unread}) ${title}`;

    if (
      isEverything && this.state.showDiscoverCard && user.uid ||
      user.uid && frequencies.active === 'discover'
    ) {
      sortedStories.unshift(<NuxJoinCard />);
    }

    if (!user.uid) {
      sortedStories.unshift(<LoginCard />);
    }

    if (user.uid && frequencies.active === 'hugs-n-bugs') {
      sortedStories.unshift(<ReportBugCard />);
    }

    if (user.uid && frequencies.active === 'notifications' && unread >= 0) {
      sortedStories.unshift(<NuxJoinCard />);
    }

    return (
      <Body>
        <Helmet
          title={
            titleParam && descriptionParam ? `${title} · ${description}` : title
          }
          meta={[
            {
              name: 'description',
              content: description,
            },
            {
              name: 'og:title',
              content: title,
            },
            {
              name: 'og:description',
              content: description,
            },
            {
              name: 'og:url',
              content: `https://spectrum.chat${this.props.location.pathname}`,
            },
            {
              name: 'og:image',
              content: 'https://spectrum.chat/img/apple-icon-144x144-precomposed.png',
            },
            {
              name: 'og:type',
              content: 'website',
            },
            {
              name: 'og:site_name',
              content: 'Spectrum',
            },
            // Twitter
            {
              name: 'twitter:card',
              content: 'summary',
            },
            {
              name: 'twitter:site',
              content: '@withspectrum',
            },
            {
              name: 'twitter:image',
              content: 'https://spectrum.chat/img/apple-icon-144x144-precomposed.png',
            },
            {
              name: 'twitter:image:alt',
              content: 'Like a forum but for Mars colonists.',
            },
            {
              name: 'twitter:title',
              content: title,
            },
            {
              name: 'twitter:description',
              content: description,
            },
          ]}
        />
        <ModalRoot />
        <GalleryRoot />
        <LoadingIndicator />

        <LeftColumnContainer viewing={ui.viewing}>
          <LeftColumn unread={unread} />
        </LeftColumnContainer>

        {/* If the user is logged in, but hasn't selected a username yet prompt them to */
        }
        {!!user.uid &&
          (!user.username || !user.email) &&
          <SelectUsernameModal
            isOpen={this.state.selectModalOpen}
            promptEmail={!user.email}
            onClose={this.closeSelectModal}
          />}

        <MiddleColumnContainer active={stories.active} viewing={ui.viewing}>
          <MiddleColumn
            loggedIn={!!user.uid}
            role={
              user &&
                frequency &&
                frequency.users[user.uid] &&
                frequency.users[user.uid].permission
            }
            activeFrequency={frequencies.active}
            isPrivate={frequency && frequency.settings.private}
            stories={sortedStories}
            frequency={frequency}
          />
        </MiddleColumnContainer>

        <RightColumnContainer active={stories.active} viewing={ui.viewing}>
          <RightColumn />
        </RightColumnContainer>
      </Body>
    );
  }
}

export default connect(state => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user,
  ui: state.ui,
  notifications: state.notifications,
}))(App);
