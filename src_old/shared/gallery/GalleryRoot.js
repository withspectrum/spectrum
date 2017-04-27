import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Overlay,
  ActiveImage,
  Minigallery,
  MiniImg,
  MiniContainer,
  CloseButton,
} from './style';
import { closeGallery } from '../../actions/gallery';
import { track } from '../../EventTracker';

class GalleryRoot extends Component {
  closeGallery = () => {
    this.props.dispatch(closeGallery());
  };

  handleKeyPress = e => {
    // if no media, skip on outta here
    if (!this.props.media.media || !this.props.media.isOpen) return;

    let length = this.props.media.media.length;
    // keeping count of which index we are viewing
    let index = this.props.media.index;

    // if person taps esc, close the dialog
    if (e.keyCode === 27) {
      this.closeGallery();
    }

    // left arrow key
    if (e.keyCode === 37) {
      track('gallery', 'mini gallery navigated', null);

      if (index === 0) {
        this.props.dispatch({
          type: 'CHANGE_GALLERY_INDEX',
          index: length - 1,
        });
      } else {
        this.props.dispatch({
          type: 'CHANGE_GALLERY_INDEX',
          index: index - 1,
        });
      }
    }

    if (e.keyCode === 39) {
      track('gallery', 'mini gallery navigated', null);

      if (index < length - 1) {
        this.props.dispatch({
          type: 'CHANGE_GALLERY_INDEX',
          index: index + 1,
        });
      } else {
        this.props.dispatch({
          type: 'CHANGE_GALLERY_INDEX',
          index: 0,
        });
      }
    }
  };

  setCount = i => {
    track('gallery', 'mini gallery clicked', null);
    this.props.dispatch({
      type: 'CHANGE_GALLERY_INDEX',
      index: i,
    });
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  render() {
    let { media } = this.props;
    let images = media.media;
    let index = media.index;

    if (media.isOpen) {
      return (
        <div>
          <CloseButton onClick={this.closeGallery}>✕</CloseButton>
          <Overlay
            onClick={this.closeGallery}
            onKeyDown={this.handleKeyPress}
          />
          <ActiveImage onClick={this.incrementImage} src={images[index]} />
          <Minigallery>
            <MiniContainer>
              {images.map((image, i) => {
                return (
                  <MiniImg
                    src={image}
                    key={i}
                    onClick={() => this.setCount(i)}
                    active={i === index}
                  />
                );
              })}
            </MiniContainer>
          </Minigallery>
        </div>
      );
    } else {
      return <span />;
    }
  }
}

const mapStateToProps = state => ({
  media: state.gallery,
});

export default connect(mapStateToProps)(GalleryRoot);
