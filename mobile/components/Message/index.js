// @flow
import React from 'react';
import redraft from 'redraft';
import Text from '../Text';
import { messageRenderer } from '../../../shared/clients/draft-js/message/renderer.native';
import type { MessageInfoType } from '../../../shared/graphql/fragments/message/messageInfo';

type Props = {
  message: MessageInfoType,
  type: string,
};

const Message = ({ message, type }: Props) => {
  switch (type) {
    case 'text':
      return <Text type="body">{message.content.body}</Text>;
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
    case 'draftjs': {
      return (
        <Text>
          {redraft(JSON.parse(message.content.body), messageRenderer)}
        </Text>
      );
    }
    default:
      return null;
  }
};

export default Message;
