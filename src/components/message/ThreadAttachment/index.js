// @flow
import React from 'react';
import compose from 'recompose/compose';
import {
  getThreadById,
  type GetThreadType,
} from 'shared/graphql/queries/thread/getThread';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';
import Attachment from './Attachment';

export type Props = {
  message: MessageInfoType,
  data: {
    thread: GetThreadType,
    loading: boolean,
    error: ?string,
  },
};

const Query = ({ data, message, ...rest }: Props) => (
  <Attachment message={message} data={data} />
);

const ThreadAttachment = compose(getThreadById)(Query);

export default ThreadAttachment;
