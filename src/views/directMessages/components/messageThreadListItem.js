//@flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { timeDifference } from '../../../helpers/utils';
import { renderAvatars } from './avatars';
import {
  Wrapper,
  Row,
  Meta,
  MessageGroupTextContainer,
  MessageGroupByline,
  Usernames,
  Timestamp,
} from './style';

export const ListCardItemDirectMessageThread = ({
  thread,
  currentUser,
  active,
}) => {
  // convert the server time to an iso timestamp
  const timestamp = new Date(thread.threadLastActive).getTime();

  // get the difference in a readable format (e.g 'a week ago')
  const threadTimeDifference = timeDifference(Date.now(), timestamp);

  // filter currentUser out
  const participants = thread.participants.filter(
    user => user.id !== currentUser.id
  );

  const currentParticipant = thread.participants.filter(
    user => user.id === currentUser.id
  )[0];

  // concat a string of usernames for thread messages
  let participantsArray = participants.length > 1
    ? participants
        .map(user => user.name)
        .join(', ')
        .replace(/,(?!.*,)/gim, ' and')
    : participants[0].name;

  // pass participants to a helper function to generate the avatar displays
  const avatars = renderAvatars(participants);

  const currentParticipantLastActiveTimestamp = new Date(
    currentParticipant.lastSeen
  ).getTime();

  const isUnread = currentParticipantLastActiveTimestamp < timestamp;

  return (
    <Wrapper active={active} isUnread={isUnread}>
      <Link to={`/messages/${thread.id}`}>
        <Row>
          {avatars}
          <MessageGroupTextContainer>
            <MessageGroupByline>
              <Usernames isUnread={isUnread}>
                <p>{participantsArray}</p>
              </Usernames>
              <Timestamp isUnread={isUnread}>{threadTimeDifference}</Timestamp>
            </MessageGroupByline>
            <Meta isUnread={isUnread} nowrap>{thread.snippet}</Meta>
          </MessageGroupTextContainer>
        </Row>
      </Link>
    </Wrapper>
  );
};
