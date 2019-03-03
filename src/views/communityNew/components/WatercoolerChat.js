// @flow
import * as React from 'react';
import { InboxThreadView } from 'src/views/thread';
import { WatercoolerWrapper } from '../style';

export const WatercoolerChat = (props: Props) => {
  const { id } = props;

  return (
    <WatercoolerWrapper>
      <InboxThreadView threadViewContext={'inbox'} threadId={id} id={id} />
    </WatercoolerWrapper>
  );
};
