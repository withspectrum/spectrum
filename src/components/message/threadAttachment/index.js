// @flow
import React from 'react';
import compose from 'recompose/compose';
import {
  getThreadById,
  type GetThreadType,
} from 'shared/graphql/queries/thread/getThread';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo.js';
import Attachment from './attachment';

export type Props = {
  currentUser: UserInfoType,
  message: MessageInfoType,
  id: string,
  data: {
    thread: GetThreadType,
    loading: boolean,
    error: ?string,
  },
};

const Query = ({ data, message, id, ...rest }: Props) => (
  <Attachment message={message} id={id} data={data} />
);

const ThreadAttachment = compose(getThreadById)(Query);

export default ThreadAttachment;
