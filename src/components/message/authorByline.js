// @flow
import * as React from 'react';
import { convertTimestampToTime } from 'shared/time-formatting';
import Link from 'src/components/link';
import Badge from '../badges';
import { Byline, Name, Username, GutterTimestamp } from './style';
import { UserHoverProfile } from 'src/components/hoverProfile';
import ConditionalWrap from 'src/components/conditionalWrap';

type Props = {
  user: Object,
  timestamp: string,
  roles?: Array<string>,
  messageUrl: string,
};

export default (props: Props) => {
  const { user, roles, timestamp, messageUrl } = props;
  return (
    <Byline>
      <ConditionalWrap
        condition={!!user.username}
        wrap={children => (
          <UserHoverProfile username={user.username}>
            <Link to={`/users/${user.username}`}>
              {children}
              <Username>{user.username && `@${user.username}`}</Username>
            </Link>
          </UserHoverProfile>
        )}
      >
        <Name>{user.name}</Name>
      </ConditionalWrap>

      {roles && roles.map((role, index) => <Badge type={role} key={index} />)}
      {user.isPro && <Badge type="pro" />}
      <GutterTimestamp to={messageUrl} data-cy="message-timestamp">
        {convertTimestampToTime(new Date(timestamp))}
      </GutterTimestamp>
    </Byline>
  );
};
