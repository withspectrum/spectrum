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
  MessageCount,
  MetaFreq,
  FrequencyLink,
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

              <MessageCount>
                {messages > 0
                  ? <span>{`${messages} messages`}&nbsp;</span>
                  : isNew ? <span /> : <span>No messages yet&nbsp;</span>}
                {unreadMessages > 0 &&
                  <span>
                    <UnreadCount>
                      {` (${unreadMessages} new!)`}&nbsp;
                    </UnreadCount>
                  </span>}
                {isNew && <span><UnreadCount> New!</UnreadCount></span>}
              </MessageCount>
            </StoryBody>
            <StoryHeader>
              <UserMeta>
                <Name>
                  <Avatar src={person.photo} />
                  {person.name}&nbsp;·&nbsp;
                  {timeDifference(Date.now(), timestamp)}
                  {metaText &&
                    metaLink &&
                    <FrequencyLink>
                      &nbsp;in&nbsp;
                      <Link to={metaLink}>
                        {metaText}
                      </Link>
                    </FrequencyLink>}
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
