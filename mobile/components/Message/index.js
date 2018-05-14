// @flow
import React from 'react';
import redraft from 'redraft';
import Text from '../Text';
import { messageRenderer } from '../../../shared/clients/draft-js/message/renderer.native';
import { Bubble, QuoteWrapper, QuotedParagraph } from './style';
import { toState, toPlainText } from '../../../shared/draft-utils';
import Author from '../Messages/Author';
import type { MessageInfoType } from '../../../shared/graphql/fragments/message/messageInfo';

type Props = {
  message: MessageInfoType,
  me: boolean,
  bubble?: boolean,
};

const Message = ({ message, me, bubble }: Props) => {
  let body =
    message.messageType === 'draftjs'
      ? redraft(JSON.parse(message.content.body), messageRenderer)
      : message.content.body;
  switch (message.messageType) {
    // case 'media': {
    //   // don't apply imgix url params to optimistic image messages
    //   const src = props.id
    //     ? message.body
    //     : `${message.body}?max-w=${window.innerWidth * 0.6}`;
    //   if (typeof data.id === 'number' && data.id < 0) {
    //     return null;
    //   }
    //   return <Image onClick={openGallery} src={src} />;
    // }
    // case 'emoji':
    //   return <Text type="body">{message.content.body}</Text>;
    case 'text':
    case 'draftjs': {
      if (bubble !== false) {
        return (
          <Bubble me={me}>
            {/* $FlowIssue */}
            {message.parent ? <QuotedMessage message={message.parent} /> : null}
            <Text color={me ? '#FFFFFF' : '#000000'}>{body}</Text>
          </Bubble>
        );
      }
      return <Text color={me ? '#FFFFFF' : '#000000'}>{body}</Text>;
    }
    default:
      return null;
  }
};

type QuotedMessageProps = {
  message: MessageInfoType,
};

type QuotedMessageState = {
  isShort: boolean,
  isExpanded: boolean,
};

export class QuotedMessage extends React.Component<
  QuotedMessageProps,
  QuotedMessageState
> {
  constructor(props: QuotedMessageProps) {
    super(props);

    const isShort = () => {
      if (props.message.messageType === 'media') return false;
      const jsonBody = JSON.parse(props.message.content.body);
      return (
        !jsonBody.blocks.length > 1 ||
        toPlainText(toState(jsonBody)).length <= 170
      );
    };

    this.state = {
      isShort: isShort(),
      isExpanded: isShort(),
    };
  }

  shouldComponentUpdate(
    nextProps: QuotedMessageProps,
    nextState: QuotedMessageState
  ) {
    return nextState.isExpanded !== this.state.isExpanded;
  }

  toggle = () => {
    if (this.state.isShort) return;
    this.setState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  render() {
    const { message } = this.props;
    const { isExpanded, isShort } = this.state;
    return (
      <QuoteWrapper expanded={isExpanded} onPress={this.toggle}>
        <Author me={false} avatar={false} author={message.author} />
        <QuotedParagraph>
          <Message bubble={false} message={message} me={false} />
        </QuotedParagraph>
        {/* {!isExpanded && <QuoteWrapperGradient />} */}
      </QuoteWrapper>
    );
  }
}

export default Message;
