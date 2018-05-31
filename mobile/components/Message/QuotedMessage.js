// @flow
import React from 'react';
import TouchableOpacity from '../TouchableOpacity';
import Message from './';
import Author from '../Messages/Author';
import { QuoteWrapper, QuotedParagraph, QuoteGradient } from './style';

import { isShort } from '../../../shared/clients/draft-js/utils/isShort';
import type { MessageInfoType } from '../../../shared/graphql/fragments/message/messageInfo';

type QuotedMessageProps = {
  message: MessageInfoType,
  noPadding?: boolean,
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
    const { message, noPadding = false } = this.props;
    const { isExpanded, isShort } = this.state;
    // TODO(@mxstbr): Use <ConditionalWrap> to only add TouchableOpacity to long messages
    return (
      <TouchableOpacity onPress={this.toggle}>
        <QuoteWrapper noPadding={noPadding} expanded={isExpanded}>
          <Author me={false} avatar={false} author={message.author} />
          <QuotedParagraph>
            <Message bubble={false} message={message} me={false} />
          </QuotedParagraph>
          {!isExpanded && <QuoteGradient />}
        </QuoteWrapper>
      </TouchableOpacity>
    );
  }
}
