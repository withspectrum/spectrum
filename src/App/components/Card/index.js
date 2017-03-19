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
  FrequencyLink,
  Title,
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
    unreadMentions: PropTypes.number,
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
      messages,
      metaLink,
      metaText,
      person,
      timestamp,
      title,
      unreadMessages,
      unreadMentions,
    } = this.props;

    let unreadText;

    if (unreadMentions > 0) {
      unreadText = ` (${unreadMentions} ${unreadMentions > 1
        ? 'mentions'
        : 'mention'}!)`;
    } else if (unreadMessages > 0) {
      unreadText = ` (${unreadMessages} new!)`;
    }

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
                {unreadText &&
                  <span>
                    <UnreadCount>
                      {unreadText}&nbsp;
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
