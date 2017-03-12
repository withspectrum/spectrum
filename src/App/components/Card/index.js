import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import {
  Wrapper,
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
  UnreadCount,
} from './style';
import { openGallery } from '../../../actions/gallery';
import { timeDifference } from '../../../helpers/utils';

const canBeBool = (...types) => PropTypes.oneOfType([PropTypes.bool, ...types]);

class Card extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
    isNew: PropTypes.bool,
    link: PropTypes.string.isRequired,
    media: canBeBool(PropTypes.string),
    messages: canBeBool(PropTypes.number),
    metaLink: canBeBool(PropTypes.string),
    metaText: canBeBool(PropTypes.string),
    person: PropTypes.shape({
      name: PropTypes.string.isRequired,
      photo: PropTypes.string.isRequired,
    }),
    timestamp: PropTypes.number,
    title: PropTypes.string.isRequired,
    unreadMessages: PropTypes.number,
  };

  openGallery = e => {
    let arr = [];
    arr.push(e.target.src);
    this.props.dispatch(openGallery(arr));
  };

  render() {
    const {
      isActive,
      isNew,
      link,
      media,
      messages,
      metaLink,
      metaText,
      person,
      timestamp,
      title,
      unreadMessages,
      showDirtyDot,
    } = this.props;

    return (
      <Wrapper>
        <Link to={link}>
          <LinkWrapper selected={isActive}>
            <StoryHeader>
              <Avatar src={person.photo} alt={person.name} />
              <UserMeta>
                <Name>{person.name}</Name>
                <Meta>
                  {timeDifference(Date.now(), timestamp)}
                  {messages > 0
                    ? <span>&nbsp;·&nbsp;{`${messages} messages`}</span>
                    : isNew ? '' : <span>&nbsp;·&nbsp;No messages yet</span>}
                  {unreadMessages > 0 &&
                    <UnreadCount>{` (${unreadMessages} new!)`}</UnreadCount>}
                  {isNew &&
                    <span>&nbsp;·&nbsp;<UnreadCount>New!</UnreadCount></span>}
                </Meta>
              </UserMeta>
            </StoryHeader>
            <StoryBody>
              <Title>{title}</Title>
              {media && media !== ''
                ? <Media src={media} onClick={this.openGallery} />
                : ''}
            </StoryBody>
          </LinkWrapper>
        </Link>

        {metaText &&
          metaLink &&
          <Link to={metaLink}>
            <MetaFreq>{metaText}</MetaFreq>
          </Link>}
      </Wrapper>
    );
  }
}
export default Card;
