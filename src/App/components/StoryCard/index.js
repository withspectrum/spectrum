import React, { Component } from 'react';
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
import { timeDifference } from '../../../helpers/utils';

class StoryCard extends Component {
  showGallery = e => {
    let arr = [];
    arr.push(e.target.src);
    this.props.dispatch(showGallery(arr));
  };

  render() {
    const { frequency, story, urlBase, isEverything, active } = this.props;

    let messages;
    if (story.messages) {
      messages = Object.keys(story.messages);
    }

    return (
      <Card>
        <Link to={`/${urlBase}/${story.id}`}>
          <LinkWrapper selected={story.id === active}>
            <StoryHeader>
              <Avatar
                src={story.creator.photoURL}
                alt={story.creator.displayName}
              />
              <UserMeta>
                <Name>{story.creator.displayName}</Name>
                <Meta>
                  {timeDifference(Date.now(), story.timestamp)}
                  &nbsp;•&nbsp;
                  {messages && messages.length > 0
                    ? `${messages.length} messages`
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

        {isEverything && frequency
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
export default StoryCard;
