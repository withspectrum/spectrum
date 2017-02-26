import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// eslint-disable-next-line
import {
  Card,
  LinkWrapper,
  StoryBody,
  StoryHeader,
  Avatar,
  UserMeta,
  Name,
  Meta,
  MetaFreq,
  Title,
  Media,
} from './style';
import { getCurrentFrequency } from '../../../helpers/frequencies';
import { showGallery } from '../../../actions/gallery';

class StoryCard extends Component {
  showGallery = e => {
    let arr = [];
    arr.push(e.target.src);
    this.props.dispatch(showGallery(arr));
  };

  render() {
    const story = this.props.data;
    const frequency = getCurrentFrequency(
      story.frequencyId,
      this.props.frequencies.frequencies,
    );

    const timestamp = story.timestamp;
    let currentTime = Date.now();

    function timeDifference(current, previous) {
      const msPerMinute = 60 * 1000;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      const msPerMonth = msPerDay * 30;
      const msPerYear = msPerDay * 365;

      let elapsed = current - previous;

      if (elapsed < msPerMinute) {
        return 'Just now';
      } else if (elapsed < msPerHour) {
        const now = Math.round(elapsed / msPerMinute);
        if (now === 1) {
          return `1 minute ago`;
        } else {
          return `${now} minutes ago`;
        }
      } else if (elapsed < msPerDay) {
        const now = Math.round(elapsed / msPerHour);
        if (now === 1) {
          return `1 hour ago`;
        } else {
          return `${now} hours ago`;
        }
      } else if (elapsed < msPerMonth) {
        const now = Math.round(elapsed / msPerDay);
        if (now === 1) {
          return `Yesterday`;
        } else if (now >= 7 && now <= 13) {
          return 'A week ago';
        } else if (now >= 14 && now <= 20) {
          return '2 weeks ago';
        } else if (now >= 21 && now <= 28) {
          return '3 weeks ago';
        } else {
          return `${now} days ago`;
        }
      } else if (elapsed < msPerYear) {
        const now = Math.round(elapsed / msPerMonth);
        if (now === 1) {
          return `A month ago`;
        } else {
          return `${now} months ago`;
        }
      } else {
        const now = Math.round(elapsed / msPerYear);
        if (now === 1) {
          return `A year ago`;
        } else {
          return `${now} years ago`;
        }
      }
    }

    return (
      <Card>
        <Link to={`/${this.props.urlBase}/${story.id}`}>
          <LinkWrapper selected={story.id === this.props.stories.active}>
            <StoryHeader>
              <Avatar
                src={story.creator.photoURL}
                alt={story.creator.displayName}
              />
              <UserMeta>
                <Name>{story.creator.displayName}</Name>
                <Meta>
                  {timeDifference(currentTime, timestamp)}
                  &nbsp;•&nbsp;
                  {story.message_count > 0
                    ? `${story.message_count} messages`
                    : 'No messages yet'}
                </Meta>
              </UserMeta>
            </StoryHeader>
            <StoryBody>
              <Title>{story.content.title}</Title>
              {story.content.media && story.content.media !== ''
                ? <Media src={story.content.media} onClick={this.showGallery} />
                : ''}
            </StoryBody>
          </LinkWrapper>
        </Link>

        {this.props.frequencies.active === 'everything' && frequency
          ? <Link to={`/~${frequency.slug}`}>
              <MetaFreq>
                ~{frequency.name}
              </MetaFreq>
            </Link>
          : ``}

      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    stories: state.stories,
    user: state.user,
    frequencies: state.frequencies,
  };
};

export default connect(mapStateToProps)(StoryCard);
