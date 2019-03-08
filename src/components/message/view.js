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
  ThreadAttachmentsContainer,
} from './style';
import ThreadAttachment from './ThreadAttachment';
import { messageRenderer } from 'shared/clients/draft-js/message/renderer';
import { toPlainText, toState } from 'shared/draft-utils';
import { draftOnlyContainsEmoji } from 'shared/only-contains-emoji';
import { Byline, Name, Username } from './style';
import { isShort } from 'shared/clients/draft-js/utils/isShort';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';
import { messageTypeObj } from 'shared/draft-utils/message-types';

type BodyProps = {
  openGallery: Function,
  me: boolean,
  message: MessageInfoType,
  bubble?: boolean,
  showParent?: boolean,
};

// This regexp matches /community/channel/slug~id, /?thread=id, /?t=id etc.
// see https://regex101.com/r/aGamna/2/
const MATCH_SPECTRUM_URLS = /(?:(?:https?:\/\/)?|\B)(?:spectrum\.chat|localhost:3000)\/.*?(?:~|(?:\?|&)t=|(?:\?|&)thread=)([^&\s]*)/gim;
const getSpectrumThreadIds = (text: string) => {
  let ids = [];
  let match;
  while ((match = MATCH_SPECTRUM_URLS.exec(text))) {
    ids.push(match[1]);
  }
  return ids;
};

export const Body = (props: BodyProps) => {
  const { showParent = true, message, openGallery, me, bubble = true } = props;
  const emojiOnly =
    message.messageType === messageTypeObj.draftjs &&
    draftOnlyContainsEmoji(JSON.parse(message.content.body));
  const WrapperComponent = bubble ? Text : QuotedParagraph;
  switch (message.messageType) {
    case 'optimistic':
      return (
        <div class="markdown">
          <WrapperComponent me={me}>
            <div dangerouslySetInnerHTML={{ __html: message.content.body }} />
          </WrapperComponent>
        </div>
      );
    case messageTypeObj.text:
    default:
      return (
        <WrapperComponent me={me}>{message.content.body}</WrapperComponent>
      );
    case messageTypeObj.media: {
      if (typeof message.id === 'number' && message.id < 0) {
        return null;
      }
      return <Image onClick={openGallery} src={message.content.body} />;
    }
    case messageTypeObj.draftjs: {
      const parsed = JSON.parse(message.content.body);
      const ids = getSpectrumThreadIds(toPlainText(toState(parsed)));
      const uniqueIds = ids.filter((x, i, a) => a.indexOf(x) === i);
      return (
        <WrapperComponent me={me}>
          {message.parent && showParent && (
            // $FlowIssue
            <QuotedMessage message={message.parent} />
          )}
          {emojiOnly ? (
            <Emoji>
              {parsed && Array.isArray(parsed.blocks) && parsed.blocks[0].text}
            </Emoji>
          ) : (
            <div className="markdown">{redraft(parsed, messageRenderer)}</div>
          )}
          {uniqueIds && (
            <ThreadAttachmentsContainer>
              {uniqueIds.map(id => (
                <ThreadAttachment message={message} key={id} id={id} />
              ))}
            </ThreadAttachmentsContainer>
          )}
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

  toggle = (e: any) => {
    e.stopPropagation();
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
