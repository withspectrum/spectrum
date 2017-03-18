import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
import ParticipantHeads from './ParticipantHeads';

const canBeBool = (...types) => PropTypes.oneOfType([PropTypes.bool, ...types]);

class Card extends Component {
  constructor() {
    super();

    const sayings = ["chit chattin'", 'talking', 'hanging out', 'chatting'];

    this.state = {
      saying: sayings[Math.floor(Math.random() * sayings.length)],
    };
  }
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
    participants: PropTypes.object,
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
      participants,
      user,
    } = this.props;

    let heads;

    // if the story has at least 3 participants
    if (participants && Object.keys(participants).length >= 3) {
      if (
        !Object.keys(participants).every(participant => user.list[participant])
      ) {
        heads = <ParticipantHeads loading />;
      } else {
        heads = (
          <ParticipantHeads
            saying={this.state.saying}
            me={user.uid}
            unread={unreadMessages}
            participants={participants}
            list={user.list}
          />
        );
      }
    } else {
      heads = (
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
      );
    }

    return (
      <Wrapper>
        <Link to={link}>
          <LinkWrapper selected={isActive}>
            <StoryBody>
              <Title>{title}</Title>

              {heads}

            </StoryBody>
            <StoryHeader>
              <UserMeta>
                <Name>
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

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Card);
