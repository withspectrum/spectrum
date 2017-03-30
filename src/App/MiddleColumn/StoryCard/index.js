import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { track } from '../../../EventTracker';
// eslint-disable-next-line
import {
  StoryBody,
  StoryFooter,
  Name,
  JoinTheConvo,
  MessageCount,
  Title,
  UnreadCount,
  LinkPreviewContainer,
  HeadsContainer,
  StatusBar,
  StatusText,
  Dot,
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

  handleClick = (e, url) => {
    e.preventDefault();

    track('link preview', 'clicked', url);
    window.open(url, '_blank');
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
      Object.keys(participants).length >= 0 &&
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
    }

    let status;
    status = 'default';
    isActive ? status = 'active' : null;
    isNew ? status = 'new' : null;
    unreadMessages > 0 ? status = 'unread' : null;

    return (
      <Card link={link} selected={isActive}>

        <StatusBar status={status}>
          {isNew &&
            <span>
              <StatusText status={status}>
                New!
              </StatusText>
              <Dot status={status} />
            </span>}

          {unreadMessages > 0 &&
            <span>
              <StatusText status={status}>
                {`${unreadMessages} new`}
                {' '}·{' '}
                {timeDifference(Date.now(), timestamp)}
              </StatusText>
              <Dot status={status} />
            </span>}

          {isActive &&
            messages > 0 &&
            <StatusText status={status}>
              {`${messages} messages`}
              {' '}·{' '}
              {timeDifference(Date.now(), timestamp).toLowerCase()}
            </StatusText>}

          {isActive &&
            messages === 0 &&
            <StatusText status={status}>
              Posted {timeDifference(Date.now(), timestamp)}
            </StatusText>}

          {!isNew &&
            !unreadMessages &&
            !isActive &&
            messages > 0 &&
            <StatusText status={status}>
              {`${messages} messages`}
              {' '}·{' '}
              {timeDifference(Date.now(), timestamp).toLowerCase()}
            </StatusText>}

          {!isNew &&
            !unreadMessages &&
            !isActive &&
            messages === 0 &&
            <StatusText status={status}>
              Posted {timeDifference(Date.now(), timestamp).toLowerCase()}
            </StatusText>}
        </StatusBar>

        <StoryBody>
          <Title>{title}</Title>

          {metadata &&
            <LinkPreviewContainer
              onClick={e => this.handleClick(e, metadata.trueUrl).toLowerCase()}
            >
              <LinkPreview
                trueUrl={metadata.trueUrl}
                data={metadata.data}
                size={'small'}
                editable={false}
              />
            </LinkPreviewContainer>}
        </StoryBody>

        <HeadsContainer>
          {heads}
        </HeadsContainer>

        <StoryFooter>
          <Name>
            By {person.name} {metaText ? ' · ' : ''}
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
