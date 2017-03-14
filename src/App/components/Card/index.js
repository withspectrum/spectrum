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
      privateFreq,
      person,
      timestamp,
      title,
      unreadMessages,
    } = this.props;

    return (
      <Wrapper>
        <Link to={link}>
          <LinkWrapper selected={isActive}>
            <StoryBody>
              <Title>{title}</Title>
            </StoryBody>
            <StoryHeader>
              <UserMeta>
                <Name>
                  {person.name}&nbsp;·&nbsp;
                  {timeDifference(Date.now(), timestamp)}
                  {metaText &&
                    metaLink &&
                    <span>
                      &nbsp;in&nbsp;
                      <Link to={metaLink}>
                        {metaText}
                      </Link>
                    </span>}
                </Name>
                <Name>
                  {messages > 0
                    ? <span>{`${messages} messages`}</span>
                    : isNew ? '' : <span>No messages yet</span>}
                  {unreadMessages > 0 &&
                    <span>
                      &nbsp;·&nbsp;
                      <UnreadCount>{` (${unreadMessages} new!)`}</UnreadCount>
                    </span>}
                  {isNew && <span><UnreadCount>New!</UnreadCount></span>}
                </Name>
              </UserMeta>
            </StoryHeader>
          </LinkWrapper>
        </Link>
      </Wrapper>
    );
  }
}
export default Card;
