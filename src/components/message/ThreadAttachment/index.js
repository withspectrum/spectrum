// @flow
import React from 'react';
import compose from 'recompose/compose';
import {
  getThreadById,
  type GetThreadType,
} from 'shared/graphql/queries/thread/getThread';
import Attachment from './Attachment';

export type Props = {
  data: {
    thread: GetThreadType,
    loading: boolean,
    error: ?string,
  },
};

const Query = ({ data, ...rest }: Props) => <Attachment data={data} />;

const ThreadAttachment = compose(getThreadById)(Query);

export default ThreadAttachment;
