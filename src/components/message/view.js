// @flow
import React from 'react';
import redraft from 'redraft';
import Icon from '../icons';
import {
  Text,
  Emoji,
  Image,
  QuoteWrapper,
  QuoteWrapperGradient,
  QuotedParagraph,
} from './style';
import { messageRenderer } from 'shared/clients/draft-js/message/renderer.web';
import { toPlainText, toState } from 'shared/draft-utils';
import { draftOnlyContainsEmoji } from 'shared/only-contains-emoji';
import { Byline, Name, Username } from './style';
import { isShort } from 'shared/clients/draft-js/utils/isShort';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';

type BodyProps = {
  openGallery: Function,
  me: boolean,
  message: MessageInfoType,
  bubble?: boolean,
  showParent?: boolean,
};

export const Body = (props: BodyProps) => {
  const { showParent = true, message, openGallery, me, bubble = true } = props;
  const emojiOnly =
    message.messageType === 'draftjs' &&
    draftOnlyContainsEmoji(JSON.parse(message.content.body));
  if (emojiOnly)
    return (
      <Emoji>{toPlainText(toState(JSON.parse(message.content.body)))}</Emoji>
    );
  const WrapperComponent = bubble ? Text : QuotedParagraph;
  switch (message.messageType) {
    case 'text':
    default:
      return (
        <WrapperComponent me={me}>{message.content.body}</WrapperComponent>
      );
    case 'media': {
      // don't apply imgix url params to optimistic image messages
      const src = props.id
        ? message.content.body
        : `${message.content.body}?max-w=${window.innerWidth * 0.6}`;
      if (typeof message.id === 'number' && message.id < 0) {
        return null;
      }
      return <Image onClick={openGallery} src={src} />;
    }
    case 'draftjs': {
      return (
        <WrapperComponent me={me}>
          {message.parent &&
            showParent && (
              // $FlowIssue
              <QuotedMessage message={message.parent} />
            )}
          {redraft(JSON.parse(message.content.body), messageRenderer)}
        </WrapperComponent>
      );
    }
  }
};

type QuotedMessageProps = {
  message: MessageInfoType,
  openGallery?: Function,
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

    const short = isShort(props.message);
    this.state = {
      isShort: short,
      isExpanded: short,
    };
  }

  shouldComponentUpdate(
    nextProps: QuotedMessageProps,
    nextState: QuotedMessageState
  ) {
    const curr = this.props;
    if (curr.message.id !== nextProps.message.id) return true;
    return nextState.isExpanded !== this.state.isExpanded;
  }

  toggle = () => {
    if (this.state.isShort) return;
    this.setState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  render() {
    const { message, openGallery } = this.props;
    const { isExpanded } = this.state;
    return (
      <QuoteWrapper
        expanded={isExpanded}
        onClick={this.toggle}
        data-cy="quoted-message"
      >
        <Byline>
          <Icon glyph="reply" size={16} />
          <Name>{message.author.user.name}</Name>
          <Username>@{message.author.user.username}</Username>
        </Byline>
        <Body
          message={message}
          showParent={false}
          me={false}
          openGallery={openGallery ? openGallery() : () => {}}
          bubble={false}
        />
        {!isExpanded && <QuoteWrapperGradient />}
      </QuoteWrapper>
    );
  }
}
