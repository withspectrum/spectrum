import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { closeGallery } from '../../actions/gallery';
import {
  Overlay,
  ActiveImage,
  Minigallery,
  MiniImg,
  MiniContainer,
  CloseButton,
  GalleryWrapper,
} from './style';

class Browser extends Component {
  state: {
    images: Array<Object>,
    activeMessageId: string,
    index: number,
  };

  constructor(props) {
    super(props);
    // if there are no messages found
    if (!props.data.images || props.data.images.length === 0) return;

    let index;
    props.data.images.map((message, i) => {
      if (message.id === props.activeMessageId) {
        index = i;
        return message;
      } else {
        return message;
      }
    });

    this.state = {
      images: props.data.images,
      activeMessageId: props.activeMessageId,
      index,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  closeGallery = () => {
    this.props.dispatch(closeGallery());
  };

  handleKeyPress = e => {
    const { images } = this.state;
    // if no media, skip on outta here
    if (!images) return;

    // if person taps esc, close the dialog
    if (e.keyCode === 27) {
      this.closeGallery();
    }

    // left arrow key
    if (e.keyCode === 37) {
      this.previousImage();
    }

    if (e.keyCode === 39) {
      this.nextImage();
    }
  };

  previousImage = () => {
    let { index, images } = this.state;
    if (index === 0) {
      index = images.length - 1;
      this.setState({
        index,
      });
    } else {
      index -= 1;

      this.setState({
        index,
      });
    }
  };

  nextImage = () => {
    let { index, images } = this.state;

    if (index === images.length - 1) {
      index = 0;
      this.setState({
        index,
      });
    } else {
      index += 1;

      this.setState({
        index,
      });
    }
  };

  setCount = i => {
    this.setState({
      index: i,
    });
  };

  render() {
    const { images, index } = this.state;

    if (!images || images.length === 0) return null;

    // when a user uploads an image, sometimes the resulting image doesn't get updated in the Apollo cache
    // if it doesn't update in the cache, then the browser component will receive a bad `activeMessageId`
    // prop. If it's the case that this happens, we just select the *last* image, assuming it's the one that the user just uploaded.
    let filteredIndex;
    if (index === null || index === undefined) {
      filteredIndex = images.length - 1;
    } else {
      filteredIndex = index;
    }

    return (
      <GalleryWrapper>
        <CloseButton onClick={this.closeGallery}>✕</CloseButton>
        <Overlay onClick={this.closeGallery} onKeyDown={this.handleKeyPress} />
        <ActiveImage
          onClick={this.nextImage}
          src={`${images[filteredIndex].src}?max-w=${window.innerWidth}`}
        />
        <Minigallery>
          <MiniContainer>
            {images.map((image, i) => {
              return (
                <MiniImg
                  src={`${image.src}?max-w=64`}
                  key={i}
                  onClick={() => this.setCount(i)}
                  active={i === filteredIndex}
                />
              );
            })}
          </MiniContainer>
        </Minigallery>
      </GalleryWrapper>
    );
  }
}

export default connect()(Browser);
