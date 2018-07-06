// @flow
import * as React from 'react';
import { convertTimestampToTime } from 'shared/time-formatting';
import Link from 'src/components/link';
import Badge from '../badges';
import { Byline, Name, Username, GutterTimestamp } from './style';

type Props = {
  user: Object,
  timestamp: string,
  roles?: Array<string>,
};

export default (props: Props) => {
  const { user, roles, timestamp } = props;
  return (
    <Byline>
      {user.username ? (
        <Link to={`/users/${user.username}`}>
          <Name>{user.name}</Name>{' '}
          <Username>{user.username && `@${user.username}`}</Username>
        </Link>
      ) : (
        <Name>{user.name}</Name>
      )}
      {roles && roles.map((role, index) => <Badge type={role} key={index} />)}
      {user.isPro && <Badge type="pro" />}
      <GutterTimestamp>
        {convertTimestampToTime(new Date(timestamp))}
      </GutterTimestamp>
    </Byline>
  );
};
