import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import deepEqual from 'deep-eql';
import { track } from '../../../EventTracker';
import Icon from '../../../shared/Icons';
// eslint-disable-next-line
import {
  StoryBody,
  Name,
  FreqTag,
  Title,
  LinkPreviewContainer,
  PhotosContainer,
  PhotoContainer,
  Photo,
  PhotoPlaceholder,
  HeadsContainer,
  StatusBar,
  StatusText,
} from './style';
import { openGallery } from '../../../actions/gallery';
import { openModal } from '../../../actions/modals';
import { timeDifference, hashToArray } from '../../../helpers/utils';
import Card from '../../../shared/Card';
import ParticipantHeads from './ParticipantHeads';
import LinkPreview from '../../../shared/LinkPreview';

const canBeBool = (...types) => PropTypes.oneOfType([PropTypes.bool, ...types]);

class StoryCard extends Component {
  constructor() {
    super();

    this.state = {
      photos: [],
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
      uid: PropTypes.string.isRequired,
    }),
    timestamp: PropTypes.number,
    title: PropTypes.string.isRequired,
    unreadMessages: PropTypes.number,
    participants: PropTypes.object,
    metadata: PropTypes.object,
    story: PropTypes.object.isRequired,
  };

  componentWillMount = () => {
    const { metadata, story } = this.props;
    if (metadata && metadata.photos && !story.deleted) {
      let photoKeys = hashToArray(metadata.photos);
      this.setState({
        photos: photoKeys,
      });
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState)
    );
  };

  componentWillUpdate = nextProps => {
    if (nextProps.metadata !== this.props.metadata) {
      if (nextProps.metadata && !nextProps.story.deleted) {
        let photoKeys = hashToArray(nextProps.metadata.photos);
        this.setState({
          photos: photoKeys,
        });
      }
    }
  };

  openGallery = (e, story) => {
    this.props.dispatch(openGallery(e, story));
  };

  handleClick = (e, url) => {
    e.preventDefault();

    track('link preview', 'clicked', url);
    window.open(url, '_blank');
  };

  openUserProfileModal = e => {
    const user = e.target.id;

    this.props.dispatch(openModal('USER_PROFILE_MODAL', { user: user }));
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
      activeCommunity,
      metadata,
      story,
    } = this.props;

    let heads;

    // if the story has at least 3 participants
    if (
      participants &&
      Object.keys(participants).length >= 0 &&
      activeCommunity !== 'everything'
    ) {
      if (
        !Object.keys(participants).every(participant => user.list[participant])
      ) {
        heads = <ParticipantHeads loading />;
      } else {
        heads = (
          <ParticipantHeads
            me={user.uid}
            unread={unreadMessages}
            participants={participants}
            list={user.list}
            openUserProfileModal={e => this.openUserProfileModal(e)}
          />
        );
      }
    }

    let status;
    status = 'default';
    if (isActive) {
      status = 'active';
    }
    if (isNew) {
      status = 'new';
    }
    if (unreadMessages > 0 && !isActive) {
      status = 'unread';
    }

    let hasMetadata = metadata ? true : false;
    let hasLinkPreview = hasMetadata && metadata.linkPreview ? true : false;
    let hasPhotos = hasMetadata && metadata.photos ? true : false;

    let statusText;
    if (isNew) {
      statusText = 'New!';
    }

    if (unreadMessages > 0) {
      statusText = `${unreadMessages} unread ${unreadMessages === 1 ? 'message' : 'messages'}`;
    }

    if (isActive && messages > 0) {
      statusText = `${messages} ${messages === 1 ? 'message' : 'messages'}`;
    }

    if (isActive && messages === 0) {
      statusText = `${timeDifference(Date.now(), timestamp)}`;
    }

    if (!isNew && !unreadMessages && !isActive && messages > 0) {
      statusText = `${messages} ${messages === 1 ? 'message' : 'messages'}`;
    }

    if (!isNew && !unreadMessages && !isActive && messages === 0) {
      statusText = `${timeDifference(Date.now(), timestamp)}`;
    }

    return (
      <Card link={link} selected={isActive}>
        <StatusBar status={status}>
          <StatusText status={status}>
            {statusText}
          </StatusText>
          {!isActive &&
            <Icon
              icon="caret-gt"
              subtle={status === 'default'}
              reverse={status !== 'default'}
              size={16}
            />}
        </StatusBar>

        <StoryBody>
          {metaText &&
            metaLink &&
            <FreqTag>
              <Link to={metaLink}>
                {metaText}
              </Link>
            </FreqTag>}
          <Title>{title}</Title>
          <Name id={person.uid} onClick={this.openUserProfileModal}>
            {person.name}
          </Name>

          {hasMetadata &&
            hasLinkPreview &&
            !hasPhotos &&
            <LinkPreviewContainer
              onClick={e => this.handleClick(e, metadata.linkPreview.trueUrl)}
            >
              <LinkPreview
                trueUrl={metadata.linkPreview.trueUrl}
                data={metadata.linkPreview.data}
                size={'small'}
                editable={false}
              />
            </LinkPreviewContainer>}

          {hasMetadata &&
            hasPhotos &&
            <PhotosContainer size={this.state.photos.length}>
              {this.state.photos.map((photo, i) => {
                if (i < 3) {
                  return (
                    <PhotoContainer key={i} size={this.state.photos.length}>
                      <Photo
                        src={photo.url}
                        onClick={e => this.openGallery(e, story.id)}
                      />
                    </PhotoContainer>
                  );
                } else if (i === 3) {
                  return (
                    <PhotoContainer key={i} size={this.state.photos.length}>
                      <PhotoPlaceholder count={this.state.photos.length - 3} />
                    </PhotoContainer>
                  );
                } else {
                  return <span />;
                }
              })}
            </PhotosContainer>}
          <HeadsContainer>
            {heads}
          </HeadsContainer>
        </StoryBody>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    frequencies: state.frequencies,
    activeCommunity: state.communities.active,
  };
};

export default connect(mapStateToProps)(StoryCard);
