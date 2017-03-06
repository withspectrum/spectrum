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
  UnreadCout,
} from './style';
import { openGallery } from '../../../actions/gallery';
import { timeDifference } from '../../../helpers/utils';

class StoryCard extends Component {
  openGallery = e => {
    let arr = [];
    arr.push(e.target.src);
    this.props.dispatch(openGallery(arr));
  };

  render() {
    const {
      frequency,
      story,
      urlBase,
      isEverything,
      active,
      unread,
    } = this.props;

    let messages;
    if (story.messages) {
      messages = Object.keys(story.messages);
    }

    if (!story.published) return <span />;

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
                  {unread > 0 && <UnreadCout>{` (${unread} new!)`}</UnreadCout>}
                </Meta>
              </UserMeta>
            </StoryHeader>
            <StoryBody>
              <Title>{story.content.title}</Title>
              {story.content.media && story.content.media !== ''
                ? <Media src={story.content.media} onClick={this.openGallery} />
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
