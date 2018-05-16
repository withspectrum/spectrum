// @flow
import React from 'react';
import redraft from 'redraft';
import Icon from '../icons';
import {
  Text,
  Emoji,
  Image,
  ActionUI,
  Indicator,
  ActionWrapper,
  ModActionWrapper,
  Time,
  QuoteWrapper,
  QuoteWrapperGradient,
  QuotedParagraph,
} from './style';
import { messageRenderer } from 'shared/clients/draft-js/message/renderer.web';
import { toPlainText, toState } from 'shared/draft-utils';
import { onlyContainsEmoji } from '../../helpers/utils';
import { Byline, Name, Username } from '../messageGroup/style';
import { isShort } from 'shared/clients/draft-js/utils/isShort';
import type { Node } from 'react';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';

export const Body = (props: {
  openGallery: Function,
  me: boolean,
  message: MessageInfoType,
  bubble?: boolean,
  showParent?: boolean,
}) => {
  const { showParent = true, message, openGallery, me, bubble = true } = props;
  const parsedMessage =
    message.messageType &&
    message.messageType === 'draftjs' &&
    toPlainText(toState(JSON.parse(message.content.body)));
  const emojiOnly = parsedMessage && onlyContainsEmoji(parsedMessage);
  if (emojiOnly) return <Emoji>{parsedMessage}</Emoji>;
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
    return nextState.isExpanded !== this.state.isExpanded;
  }

  toggle = () => {
    if (this.state.isShort) return;
    this.setState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  render() {
    const { message, openGallery } = this.props;
    const { isExpanded, isShort } = this.state;
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
          openGallery={openGallery ? openGallery : () => {}}
          bubble={false}
        />
        {!isExpanded && <QuoteWrapperGradient />}
      </QuoteWrapper>
    );
  }
}

type ActionProps = {
  me: boolean,
  action: string,
  deleteMessage?: Function,
  replyToMessage?: Function,
};

const Action = (props: ActionProps) => {
  const { me, action, deleteMessage, replyToMessage } = props;

  switch (action) {
    case 'share':
    default:
      return (
        <ActionWrapper>
          <Icon glyph="share" tipText={'Share'} tipLocation={'top'} size={24} />
        </ActionWrapper>
      );
    case 'reply':
      return (
        <ActionWrapper>
          <Icon
            dataCy="reply-to-message"
            glyph="reply"
            tipText={`Reply`}
            tipLocation={'top'}
            size={24}
            onClick={replyToMessage}
          />
        </ActionWrapper>
      );
    case 'delete':
      return (
        <ModActionWrapper me={me}>
          <Icon
            dataCy="delete-message"
            glyph="delete"
            tipText={'Delete'}
            tipLocation={'top'}
            size={24}
            onClick={deleteMessage}
          />
        </ModActionWrapper>
      );
  }
};

export const Actions = (props: {
  me: boolean,
  canModerate: boolean,
  deleteMessage?: Function,
  replyToMessage?: Function,
  isOptimisticMessage: boolean,
  children: Node,
  message: Object,
}) => {
  const {
    me,
    canModerate,
    deleteMessage,
    replyToMessage,
    isOptimisticMessage,
    message,
  } = props;

  if (isOptimisticMessage && message.messageType === 'media') {
    return null;
  }

  return (
    <ActionUI me={me}>
      {props.children}
      <Action me={me} action="reply" replyToMessage={replyToMessage} />
      {canModerate &&
        !isOptimisticMessage && (
          <Action me={me} action={'delete'} deleteMessage={deleteMessage} />
        )}
      <Indicator me={me} />
    </ActionUI>
  );
};

export const Timestamp = (props: { me: boolean, time: string }) => (
  <Time me={props.me}>{props.time}</Time>
);
