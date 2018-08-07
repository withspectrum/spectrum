// @flow
import * as React from 'react';
import { convertTimestampToTime } from 'shared/time-formatting';
import Link from 'src/components/link';
import Badge from '../badges';
import {
  Byline,
  Name,
  Username,
  GutterTimestamp,
  BadgesContainer,
} from './style';
import { UserHoverProfile } from 'src/components/hoverProfile';
import ConditionalWrap from 'src/components/conditionalWrap';
import { MessagesContext } from 'src/components/messageGroup';

type Props = {
  user: Object,
  timestamp: string,
  roles?: Array<string>,
  messageUrl: string,
  selectedMessageId: string,
};

export default (props: Props) => {
  const { user, roles, timestamp, messageUrl, selectedMessageId } = props;
  return (
    <MessagesContext.Consumer>
      {({ selectMessage }) => {
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
                  <Badge
                    type={role}
                    key={index}
                    onClick={e => e.stopPropagation()}
                  />
                ))}
              {user.isPro && (
                <Badge type="pro" onClick={e => e.stopPropagation()} />
              )}
            </BadgesContainer>
            <GutterTimestamp
              to={messageUrl}
              data-cy="message-timestamp"
              onClick={() => selectMessage(selectedMessageId)}
            >
              {convertTimestampToTime(new Date(timestamp))}
            </GutterTimestamp>
          </Byline>
        );
      }}
    </MessagesContext.Consumer>
  );
};
