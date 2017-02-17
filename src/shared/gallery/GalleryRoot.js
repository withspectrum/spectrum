import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Overlay, ActiveImage } from './style';
import actions from '../../actions';

class GalleryRoot extends Component {
  hideGallery = () => {
    this.props.dispatch(actions.hideGallery());
  };

  handleKeyPress = e => {
    // if person taps esc, close the dialog
    if (e.keyCode === 27) {
      this.hideGallery();
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  render() {
    let { media } = this.props;
    let images = media.media;

    if (media.isOpen) {
      return (
        <div>
          <Overlay onClick={this.hideGallery} onKeyDown={this.handleKeyPress} />
          <ActiveImage src={images[0]} />
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
