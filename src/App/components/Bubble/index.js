import React from 'react';
import { connect } from 'react-redux';
import { TextBubble, ImgBubble, EmojiBubble } from './style';
import { showGallery } from '../../../actions/gallery';
import { onlyContainsEmoji, formatMessage } from '../../../helpers/utils';

class BubbleWrapper extends React.Component {
  showGallery = e => {
    this.props.dispatch(showGallery(e));
  };

  render() {
    const { type, content, me } = this.props;

    let BubbleComp;
    // mxstbr: The "emoji" specific type is legacy, remove in the future
    if (type === 'text' || type === 'emoji') {
      BubbleComp = onlyContainsEmoji(content) ? EmojiBubble : TextBubble;
      return (
        <BubbleComp
          me={me}
          dangerouslySetInnerHTML={{
            __html: formatMessage(content),
          }}
        />
      );
    } else if (type === 'media') {
      return <ImgBubble me={me} src={content} onClick={this.showGallery} />;
    }

    return null;
  }
}

export default connect()(BubbleWrapper);
