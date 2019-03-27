// @flow
import * as React from 'react';
import Icon from 'src/components/icon';
import { NullColumn, NullColumnHeading, NullColumnSubheading } from './style';

type Props = {
  viewContext:
    | ?'communityInbox'
    | 'communityProfile'
    | 'channelInbox'
    | 'channelProfile'
    | 'userProfile',
  isSearch: boolean,
  communityId: ?string,
  channelId: ?string,
};

const NullState = ({
  viewContext,
  isSearch,
  communityId,
  channelId,
}: Props) => {
  let hd;
  let cp;

  if (viewContext && viewContext === 'communityProfile') {
    hd = 'Start a conversation';
    cp = 'Ask a question, share a tip, or anything else that’s on your mind.';
  }

  if (viewContext && viewContext === 'channelProfile') {
    hd = 'There’s nothing in this channel yet';
    cp = 'But you could be the first person to post something here!';
  }

  if (viewContext && viewContext === 'userProfile') {
    hd = 'This user hasn’t posted yet';
    cp = 'But you could message them!';
  }

  if (isSearch) {
    hd = 'We didn’t find any relevant posts...';
    cp = 'Try searching again or create a new post';
  }

  const headingIcon = (communityId || channelId) && (
    <Icon glyph={'post'} size={44} />
  );

  return (
    <NullColumn>
      <span>
        {headingIcon && headingIcon}
        {hd && <NullColumnHeading>{hd}</NullColumnHeading>}
        {cp && <NullColumnSubheading>{cp}</NullColumnSubheading>}
      </span>
    </NullColumn>
  );
};

export default NullState;
