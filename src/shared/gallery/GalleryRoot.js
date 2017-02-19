import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Overlay, ActiveImage, Minigallery, MiniImg, MiniContainer } from './style';
import actions from '../../actions';

class GalleryRoot extends Component {
  constructor(props) {
    super(props)

    this.state = {
      count: 0
    }
  }

  hideGallery = () => {
    this.props.dispatch(actions.hideGallery());
  };

  handleKeyPress = e => {
    // length of image array
    let length = this.props.media.media.length
    // keeping count of which index we are viewing
    let count = this.state.count

    // if person taps esc, close the dialog
    if (e.keyCode === 27) {
      this.hideGallery();
    }

    // left arrow key
    if (e.keyCode === 37) {
      if (count === 0) {
        this.setState({
          count: length - 1
        })
      } else {
        this.setState({
          count: count - 1
        })
      }
    }

    if (e.keyCode === 39) {
      if (count < length - 1) {
        this.setState({
          count: count + 1
        })
      } else {
        this.setState({
          count: 0
        })
      }
    }
  };

  setCount = (i) => {
    this.setState({
      count: i
    })
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  render() {
    let { media } = this.props;
    let images = media.media;
    let count = this.state.count

    if (media.isOpen) {
      return (
        <div>
          <Overlay onClick={this.hideGallery} onKeyDown={this.handleKeyPress} />
          <ActiveImage onClick={this.incrementImage} src={images[count]} />
          <Minigallery>
            <MiniContainer>
              { 
                images.map((image, i) => {
                  return <MiniImg src={image} key={i} onClick={() => this.setCount(i)} active={i === this.state.count} />
                })
              }
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
