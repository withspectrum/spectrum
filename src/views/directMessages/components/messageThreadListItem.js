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
  children,
  currentUser,
  active,
}) => {
  // clone the participants array because the original array is flagged as
  // read-only by Apollo
  const clonedParticipants = thread.participants.slice(0);

  // sort the array by latest activity
  const participantsSortedByActivity = clonedParticipants.sort((x, y) => {
    const xTimestamp = new Date(x.lastActive).getTime();
    const yTimestamp = new Date(y.lastActive).getTime();
    return xTimestamp - yTimestamp;
  });

  // select the latest active participant's time
  const latestActivity = participantsSortedByActivity[0].lastActive;

  // convert the server time to an iso timestamp
  const timestamp = new Date(latestActivity).getTime();
  // get the difference in a readable format (e.g 'a week ago')
  const threadTimeDifference = timeDifference(Date.now(), timestamp);

  // filter currentUser out
  const participants = thread.participants.filter(
    user => user.id !== currentUser.id
  );

  // concat a string of usernames for thread messages
  let participantsArray = participants.length > 1
    ? participants
        .map(user => user.name)
        .join(', ')
        .replace(/,(?!.*,)/gim, ' and')
    : participants[0].name;

  // pass participants to a helper function to generate the avatar displays
  const avatars = renderAvatars(participants);

  // const currentUserLastSeen = clonedParticipants.filter(
  //   user => user.id === currentUser.id
  // )[0].lastSeen;
  //TODO: handle unread state
  //const isUnread = timestamp > new Date(currentUserLastSeen).getTime();

  return (
    <Wrapper active={active}>
      <Link to={`/messages/${thread.id}`}>
        <Row>
          {avatars}
          <MessageGroupTextContainer>
            <MessageGroupByline>
              <Usernames>
                <p>{participantsArray}</p>
              </Usernames>
              <Timestamp>{threadTimeDifference}</Timestamp>
            </MessageGroupByline>
            <Meta nowrap>{thread.snippet}</Meta>
          </MessageGroupTextContainer>
        </Row>
      </Link>
    </Wrapper>
  );
};
