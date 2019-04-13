// @flow
import * as React from 'react';
import { convertTimestampToTime } from 'shared/time-formatting';
import ConditionalWrap from 'src/components/conditionalWrap';
import { UserHoverProfile } from 'src/components/hoverProfile';
import { Link } from 'react-router-dom';
import Badge from '../badges';
import {
  BadgesContainer,
  Byline,
  GutterTimestamp,
  Name,
  Username,
} from './style';

type Props = {
  user: Object,
  timestamp: string,
  roles?: Array<string>,
  bot?: boolean,
  messageUrl: string,
};

export default (props: Props) => {
  const { user, roles, timestamp, messageUrl } = props;
  return (
    <Byline>
      <ConditionalWrap
        condition={!!user.username}
        wrap={children => (
          <UserHoverProfile
            username={user.username}
            style={{ flexWrap: 'wrap', flex: '0 1 auto' }}
          >
            <Link
              to={`/users/${user.username}`}
              onClick={e => e.stopPropagation()}
            >
              {children}
              <Username>{user.username && `@${user.username}`}</Username>
            </Link>
          </UserHoverProfile>
        )}
      >
        <Name>{user.name}</Name>
      </ConditionalWrap>

      <BadgesContainer>
        {roles &&
          roles.map((role, index) => (
            <Badge type={role} key={index} onClick={e => e.stopPropagation()} />
          ))}
        {user.betaSupporter && (
          <Badge
            type="beta-supporter"
            label={'β'}
            style={{ textTransform: 'none' }}
          />
        )}
      </BadgesContainer>
      <GutterTimestamp to={messageUrl} data-cy="message-timestamp">
        {convertTimestampToTime(new Date(timestamp))}
      </GutterTimestamp>
    </Byline>
  );
};
