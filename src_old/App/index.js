import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import LeftColumn from './LeftColumn';
import {
  Body,
  LeftColumnContainer,
  MiddleColumnContainer,
  RightColumnContainer,
  AppContainer,
  VerticalSpacer,
} from './style';
import Navbar from './NavBar';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';
import LoadingIndicator from '../shared/loading';
import ModalRoot from '../shared/modals/ModalRoot';
import SelectUsernameModal from '../shared/modals/SelectUsernameModal';
import GalleryRoot from '../shared/gallery/GalleryRoot';
import ReportBugCard from './MiddleColumn/ReportBugCard';
import NewMessageCard from './MiddleColumn/NewMessageCard';
import FrequencyHeaderCard from './MiddleColumn/FrequencyHeaderCard';
import { getCurrentFrequency } from '../helpers/frequencies';
import { debounce } from '../helpers/utils';
import {
  sortArrayByKey,
  getParameterByName,
  truncate,
  changeFavicon,
} from '../helpers/utils';
import { ACTIVITY_TYPES } from '../db/types';

class App extends Component {
  state = {
    showOnboardingCard: true, // determines if we should show the OnboardingCard
    selectModalOpen: true,
  };

  componentWillReceiveProps = nextProps => {
    this.setState({
      showOnboardingCard: Object.keys(nextProps.user.frequencies).length > 10
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
    const {
      stories,
      frequencies,
      user,
      ui,
      notifications,
      messageGroups,
      messageComposer,
      composer,
      communities,
    } = this.props;

    const communitySlug = communities.active;
    const isEverything = communitySlug === 'everything';
    const isNotifications = communitySlug === 'notifications';
    const isExplore = communitySlug === 'explore';
    const isMessages = communitySlug === 'messages';
    const community = communities.communities.find(
      community => community.slug === communitySlug
    );
    if (
      !community &&
      !isEverything &&
      !isNotifications &&
      !isExplore &&
      !isMessages
    )
      return <Body />;
    const frequency =
      community &&
      getCurrentFrequency(
        frequencies.active,
        frequencies.frequencies,
        community.id
      );

    let sortedStories = sortArrayByKey(
      stories.stories.slice(),
      'last_activity',
      'timestamp'
    )
      .reverse()
      .filter(story => !story.deleted);

    if (frequency && !isEverything) {
      sortedStories = sortedStories.filter(story => {
        return story.frequencyId === frequency.id && story.published;
      });
    }

    let sortedMessageGroups = sortArrayByKey(
      messageGroups.messageGroups.slice(),
      'last_activity',
      null
    ).reverse();

    const titleParam = getParameterByName('t', this.props.location.search);
    const descriptionParam = getParameterByName(
      'd',
      this.props.location.search
    );

    let title = titleParam;
    let description = descriptionParam;

    if (!title && !description) {
      const story = sortedStories.find(story => story.id === stories.active);
      const freq =
        frequency ||
        (story &&
          getCurrentFrequency(story.frequencyId, frequencies.frequencies));

      if (!(story && story.content) && !(freq && freq.name)) {
        title = 'Spectrum';
        description = 'Where communities are built.';
      } else {
        title = `${story && story.content ? `${truncate(story.content.title, 40)} ` : ''}${freq ? `~${freq.name} ` : ''}${(story && story.content) || freq ? '· ' : ''}Spectrum`;
        description = story && story.content
          ? `${story.content.description ? truncate(story.content.description, 150) : 'A story on Spectrum'}`
          : freq ? freq.description : 'Where communities are built.';
      }
    }

    const unread = notifications.notifications.reduce((sum, notification) => {
      if (notification.activityType !== ACTIVITY_TYPES.NEW_MESSAGE) return sum;
      const story = stories.stories.find(
        story => story.id === notification.ids.story
      );
      if (!story || story.deleted) return sum;
      return sum + notification.unread;
    }, 0);

    const unreadMessages = messageGroups.messageGroups.reduce((sum, group) => {
      if (
        !group.users[user.uid].last_seen ||
        (group.last_activity > group.users[user.uid].last_seen &&
          group.id !== messageGroups.active)
      ) {
        return sum + 1;
      }
    }, 0);

    const totalUnread = unread + (unreadMessages || 0);
    // don't call this more than once per second
    debounce(changeFavicon(totalUnread > 0 ? totalUnread : 0), 1000);

    if (totalUnread > 0) title = `(${totalUnread}) ${title}`;

    if (frequency && communitySlug !== 'everything') {
      sortedStories.unshift(<FrequencyHeaderCard />);
    }

    // if (user.uid && frequencies.active === 'hugs-n-bugs') {
    //   sortedStories.splice(1, 0, <ReportBugCard />);
    // }

    if (
      (user.uid && messageGroups.active === 'new') || messageComposer.isOpen
    ) {
      sortedMessageGroups.unshift(
        <NewMessageCard active={messageComposer.isOpen} />
      );
    }

    let isViewing;
    if (stories.active) {
      isViewing = 'story';
    } else if (messageGroups.active || isExplore) {
      isViewing = 'messageGroup';
    } else if (messageComposer.isOpen || composer.isOpen) {
      isViewing = 'composer';
    } else {
      isViewing = 'list';
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
              content: 'Where communities are built.',
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

        <Navbar />
        <VerticalSpacer />{/* used because NavBar is fixed position */}

        <AppContainer>
          <LeftColumnContainer viewing={ui.viewing}>
            <LeftColumn unread={unread} />
          </LeftColumnContainer>

          {/* If the user is logged in, but hasn't selected a username yet prompt them to */}
          {!!user.uid &&
            (!user.username || !user.email) &&
            <SelectUsernameModal
              isOpen={this.state.selectModalOpen}
              promptEmail={!user.email}
              onClose={this.closeSelectModal}
            />}

          {!isExplore &&
            <MiddleColumnContainer
              active={stories.active || messageGroups.active}
              viewing={ui.viewing}
              absolute={messageGroups.active}
            >
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
                messageGroups={sortedMessageGroups}
              />
            </MiddleColumnContainer>}

          <RightColumnContainer
            active={stories.active}
            viewing={isViewing}
            absolute={messageGroups.active || messageComposer.isOpen}
          >
            <RightColumn />
          </RightColumnContainer>
        </AppContainer>
      </Body>
    );
  }
}

export default connect(state => ({
  stories: state.stories,
  messageGroups: state.messageGroups,
  frequencies: state.frequencies,
  communities: state.communities,
  user: state.user,
  ui: state.ui,
  notifications: state.notifications,
  messageComposer: state.messageComposer,
  composer: state.composer,
}))(App);
