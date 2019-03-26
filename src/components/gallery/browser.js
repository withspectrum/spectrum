// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { closeGallery } from 'src/actions/gallery';
import type { GetMediaMessagesForThreadType } from 'shared/graphql/queries/message/getMediaMessagesForThread';
import type { Dispatch } from 'redux';
import {
  Overlay,
  ActiveImage,
  Minigallery,
  MiniImg,
  MiniContainer,
  CloseButton,
  GalleryWrapper,
} from './style';
import { ESC, ARROW_LEFT, ARROW_RIGHT } from 'src/helpers/keycodes';

type State = {
  images: Array<Object>,
  activeMessageId: string,
  index: ?number,
};

type Props = {
  dispatch: Dispatch<Object>,
  data: {
    messages?: GetMediaMessagesForThreadType,
  },
  activeMessageId: string,
};

class Browser extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    // if there are no messages found
    if (!props.data.messages || props.data.messages.length === 0) {
      this.state = {
        images: [],
        activeMessageId: props.activeMessageId,
        index: null,
      };
    }

    let index;
    props.data.messages.map((message, i) => {
      if (message.id === props.activeMessageId) {
        index = i;
        return message;
      } else {
        return message;
      }
    });

    this.state = {
      images: props.data.messages,
      activeMessageId: props.activeMessageId,
      index,
    };
  }

  componentDidMount() {
    // $FlowFixMe
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    // $FlowFixMe
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  closeGallery = () => {
    this.props.dispatch(closeGallery());
  };

  handleKeyPress = e => {
    const { images } = this.state;
    // if no media, skip on outta here
    if (!images) return;

    if (e.keyCode === ESC) {
      this.closeGallery();
    }

    if (e.keyCode === ARROW_LEFT) {
      this.previousImage();
    }

    if (e.keyCode === ARROW_RIGHT) {
      this.nextImage();
    }
  };

  previousImage = () => {
    let { index, images } = this.state;

    if (index === null) return;

    if (index === 0) {
      index = images.length - 1;
      this.setState({
        index,
      });
    } else {
      // $FlowFixMe
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
    const {
      data: { messages },
    } = this.props;

    if (!messages || messages.length === 0) return null;

    // when a user uploads an image, sometimes the resulting image doesn't get updated in the Apollo cache
    // if it doesn't update in the cache, then the browser component will receive a bad `activeMessageId`
    // prop. If it's the case that this happens, we just select the *last* image, assuming it's the one that the user just uploaded.
    let filteredIndex = typeof index === 'number' ? index : messages.length - 1;

    const src = `${images[filteredIndex].content.body}`;

    return (
      <GalleryWrapper>
        <CloseButton onClick={this.closeGallery}>✕</CloseButton>
        <Overlay onClick={this.closeGallery} onKeyDown={this.handleKeyPress} />
        <ActiveImage onClick={this.nextImage} src={src} />
        <Minigallery>
          <MiniContainer>
            {images.map((image, i) => {
              return (
                <MiniImg
                  src={`${image.content.body}`}
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
