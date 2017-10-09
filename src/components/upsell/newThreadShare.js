import * as React from 'react';
import { connect } from 'react-redux';
import { ButtonRow, Button } from '../buttons';
import { Input } from '../formElements';
import { NullCol, Title, Subtitle, ShareInputContainer } from './style';
import { addToastWithTimeout } from '../../actions/toasts';

type Props = {};
class NewThreadShare extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.thread = props.thread;
  }

  copy = () => {
    const nestedInput = this.input.childNodes[0];
    try {
      nestedInput.select();
      document.execCommand('copy');
      this.props.dispatch(
        addToastWithTimeout('success', 'Copied to clipboard')
      );
    } catch (err) {
      return;
    }
  };

  render() {
    if (!this.thread) {
      return null;
    }

    return (
      <NullCol bg={null}>
        <Title>✨ The conversation is just getting started...</Title>
        <Subtitle>
          Share on Facebook and Twitter below, or send the direct link to your
          friends.
        </Subtitle>

        <ButtonRow>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/thread/${this
              .thread.id}&t=${this.thread.content.title}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              icon="facebook"
              gradientTheme={'none'}
              hoverColor={'social.facebook.default'}
              color={'social.facebook.default'}
            >
              Share on Facebook
            </Button>
          </a>

          <a
            href={`https://twitter.com/share?text=${this.thread.content
              .title} on @withspectrum&url=https://spectrum.chat/thread/${this
              .thread.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              icon="twitter"
              gradientTheme={'none'}
              hoverColor={'social.twitter.default'}
              color={'social.twitter.default'}
            >
              Share on Twitter
            </Button>
          </a>
        </ButtonRow>

        <ShareInputContainer>
          <Input
            innerRef={input => (this.input = input)}
            onFocus={this.copy}
            defaultValue={`https://spectrum.chat/thread/${this.thread.id}`}
          />
        </ShareInputContainer>
      </NullCol>
    );
  }
}

export default connect()(NewThreadShare);
