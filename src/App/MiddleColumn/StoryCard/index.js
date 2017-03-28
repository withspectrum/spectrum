import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// eslint-disable-next-line
import {
  StoryBody,
  StoryFooter,
  Name,
  MessageCount,
  Title,
  UnreadCount,
  LinkPreviewContainer,
} from './style';
import { openGallery } from '../../../actions/gallery';
import { timeDifference } from '../../../helpers/utils';
import Card from '../../../shared/Card';
import ParticipantHeads from './ParticipantHeads';
import LinkPreview from '../../../shared/LinkPreview';

const canBeBool = (...types) => PropTypes.oneOfType([PropTypes.bool, ...types]);

class StoryCard extends Component {
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
    metadata: PropTypes.object,
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
      metadata,
      frequencies: { active },
    } = this.props;

    let heads;

    // if the story has at least 3 participants
    if (
      participants &&
      Object.keys(participants).length >= 3 &&
      active !== 'everything'
    ) {
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
      <Card link={link} selected={isActive}>
        <StoryBody>
          <Title>{title}</Title>

          {metadata &&
            <LinkPreviewContainer>
              <LinkPreview
                trueUrl={metadata.trueUrl}
                data={metadata.data}
                size={'small'}
                editable={false}
              />
            </LinkPreviewContainer>}

          {heads}

        </StoryBody>
        <StoryFooter>
          <Name>
            {person.name}&nbsp;·&nbsp;
            {timeDifference(Date.now(), timestamp)}
            {metaText && metaLink && `\u00A0in\u00A0`}
            {metaText &&
              metaLink &&
              <Link to={metaLink}>
                {metaText}
              </Link>}
          </Name>
        </StoryFooter>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    frequencies: state.frequencies,
  };
};

export default connect(mapStateToProps)(StoryCard);
