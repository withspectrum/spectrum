// @flow
import React from 'react';
import redraft from 'redraft';
import Text from '../Text';
import { messageRenderer } from '../../../shared/clients/draft-js/message/renderer.native';
import { Bubble } from './style';
import type { MessageInfoType } from '../../../shared/graphql/fragments/message/messageInfo';

type Props = {
  message: MessageInfoType,
  me: boolean,
};

const Message = ({ message, me }: Props) => {
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
      return (
        <Bubble me={me}>
          <Text
            style={{ marginTop: 0, marginBottom: 0 }}
            color={me ? '#FFFFFF' : '#000000'}
          >
            {body}
          </Text>
        </Bubble>
      );
    }
    default:
      return null;
  }
};

export default Message;
