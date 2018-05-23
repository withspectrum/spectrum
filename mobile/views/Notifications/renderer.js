// @flow
import * as React from 'react';
import type { CurrentUserState } from '../../reducers/currentUserId';
import type { Navigation } from '../../utils/types';
import { type ParsedNotificationType } from './renderUtils';
import { View, TouchableHighlight } from 'react-native';
import Avatar from '../../components/Avatar';
import Text from '../../components/Text';

type Props = {
  notification: ParsedNotificationType,
  currentUserId: CurrentUserState,
  navigation: Navigation,
};

class Renderer extends React.Component<Props> {
  renderActorsString = (): any => {
    const { navigation } = this.props;
    const actors = this.getActors();
    // reverse to show the most recent first
    if (!actors || actors.length === 0) return null;

    const names = actors.map(actor => actor.payload.name).reverse();
    const data = actors.map(actor => actor.payload).reverse();

    if (actors.length === 1) {
      return (
        <View>
          <TouchableHighlight
            onPress={() => navigation.navigate(`User`, { id: data[0].id })}
          >
            <Text>{names[0]}</Text>
          </TouchableHighlight>
        </View>
      );
    } else if (actors.length === 2) {
      return (
        <View>
          <TouchableHighlight
            onPress={() => navigation.navigate(`User`, { id: data[0].id })}
          >
            <Text>{names[0]}</Text>
          </TouchableHighlight>{' '}
          and{' '}
          <TouchableHighlight
            onPress={() => navigation.navigate(`User`, { id: data[1].id })}
          >
            <Text>{names[1]}</Text>
          </TouchableHighlight>
        </View>
      );
    } else if (actors.length === 3) {
      return (
        <View>
          <TouchableHighlight
            onPress={() => navigation.navigate(`User`, { id: data[0].id })}
          >
            <Text>{names[0]}</Text>
          </TouchableHighlight>,
          <TouchableHighlight
            onPress={() => navigation.navigate(`User`, { id: data[1].id })}
          >
            <Text>{names[1]}</Text>
          </TouchableHighlight>{' '}
          and{' '}
          <TouchableHighlight
            onPress={() => navigation.navigate(`User`, { id: data[2].id })}
          >
            <Text>{names[2]}</Text>
          </TouchableHighlight>
        </View>
      );
    } else if (actors.length >= 4) {
      return (
        <View>
          <TouchableHighlight
            onPress={() => navigation.navigate(`User`, { id: data[0].id })}
          >
            <Text>{names[0]}</Text>
          </TouchableHighlight>{' '}
          and {names.length - 1} others{' '}
        </View>
      );
    } else {
      return null;
    }
  };

  actorsToObjects = () => {
    const actors = this.getActors();

    if (!actors || actors.length == 0) return [];

    return actors
      .map(actor => {
        return {
          name: actor.payload.name,
          username: actor.payload.username,
          profilePhoto: actor.payload.profilePhoto,
          id: actor.payload.id,
        };
      })
      .reverse();
  };

  renderActorsRow = () => {
    const { navigation } = this.props;
    const actors = this.getActors();
    if (!actors || actors.length === 0) return null;

    return (
      <View>
        {actors.map(actor => (
          <Avatar
            key={actor.id}
            user={actor}
            size={'32'}
            radius={'16'}
            isOnline={actor.payload.isOnline}
            src={actor.payload.profilePhoto}
            onPress={() => navigation.navigate(`User`, { id: actor.id })}
          />
        ))}
      </View>
    );
  };

  getActors = () => {
    return this.props.notification.actors.filter(
      actor => actor.id !== this.props.currentUserId
    );
  };

  threadToString = () => {
    const { currentUserId, navigation, notification } = this.props;

    const isAuthor = notification.context.payload.creatorId === currentUserId;
    const str = isAuthor ? 'in your thread' : 'in';
    const output = `${str} ${notification.context.payload.content.title}`;

    return (
      <TouchableHighlight
        onPress={() =>
          navigation.navigate(`Thread`, { id: notification.context.id })
        }
      >
        <Text>{output}</Text>
      </TouchableHighlight>
    );
  };

  messageToString = () => {
    return <Text>'your reply'</Text>;
  };

  communityToString = () => {
    const { navigation, notification } = this.props;
    return (
      <TouchableHighlight
        onPress={() =>
          navigation.navigate(`Community`, { id: notification.context.id })
        }
      >
        <Text>{notification.context.payload.name}</Text>
      </TouchableHighlight>
    );
  };

  channelToString = () => {
    const { context } = this.props.notification;
    return <Text>{context.payload.name}</Text>;
  };

  renderContextString = () => {
    const { context } = this.props.notification;
    switch (context.type) {
      case 'SLATE':
      case 'THREAD': {
        return this.threadToString();
      }
      case 'MESSAGE': {
        return this.messageToString();
      }
      case 'COMMUNITY': {
        return this.communityToString();
      }
      case 'CHANNEL': {
        return this.channelToString();
      }
      default: {
        console.error('Invalid notification context type');
        return '';
      }
    }
  };

  parseEvent = () => {
    const { event } = this.props.notification;

    switch (event) {
      case 'MESSAGE_CREATED': {
        return <Text>replied</Text>;
      }
      case 'REACTION_CREATED': {
        return <Text>liked</Text>;
      }
      case 'CHANNEL_CREATED': {
        return <Text>created a channel</Text>;
      }
      case 'USER_JOINED_COMMUNITY': {
        return <Text>joined</Text>;
      }
      case 'PRIVATE_CHANNEL_REQUEST_SENT': {
        return <Text>requested to join</Text>;
      }
      case 'PRIVATE_CHANNEL_REQUEST_APPROVED': {
        return <Text>approved your request to join</Text>;
      }
      case 'PRIVATE_COMMUNITY_REQUEST_SENT': {
        return <Text>requested to join</Text>;
      }
      case 'PRIVATE_COMMUNITY_REQUEST_APPROVED': {
        return <Text>approved your request to join</Text>;
      }
      default: {
        return '';
      }
    }
  };

  timeDifferenceShort(current: number, previous: number) {
    const msPerSecond = 1000;
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
      const now = Math.round(elapsed / msPerSecond);
      return <Text>{now}s</Text>;
    } else if (elapsed < msPerHour) {
      const now = Math.round(elapsed / msPerMinute);
      return <Text>{now}m</Text>;
    } else if (elapsed < msPerDay) {
      const now = Math.round(elapsed / msPerHour);
      return <Text>{now}h</Text>;
    } else if (elapsed < msPerYear) {
      const now = Math.round(elapsed / msPerDay);
      return <Text>{now}d</Text>;
    } else {
      const now = Math.round(elapsed / msPerYear);
      return <Text>{now}y</Text>;
    }
  }

  parseNotificationDate = () => {
    const { createdAt, modifiedAt } = this.props.notification;
    const date = modifiedAt || createdAt;

    const now = new Date().getTime();
    const timestamp = new Date(date).getTime();
    return <Text>· {this.timeDifferenceShort(now, timestamp)}</Text>;
  };

  render() {
    return (
      <View>
        {this.renderActorsRow()}
        {this.renderActorsString()}
        {this.parseEvent()}
        {this.renderContextString()}
        {this.parseNotificationDate()}
      </View>
    );
  }
}

export default Renderer;
