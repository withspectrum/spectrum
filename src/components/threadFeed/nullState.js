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
  communityId: ?string,
  channelId: ?string,
};

const NullState = ({ viewContext, communityId, channelId }: Props) => {
  let hd;
  let cp;

  if (viewContext && viewContext === 'communityProfile') {
    hd = 'There’s nothing in this community';
  }

  if (viewContext && viewContext === 'channelProfile') {
    hd = 'There’s nothing in this channel';
  }

  if (viewContext && viewContext === 'userProfile') {
    hd = 'This user hasn’t posted yet';
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
