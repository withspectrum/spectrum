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
  // convert the server time to an iso timestamp
  let timestamp = new Date(thread.lastActivity).getTime();
  // get the difference in a readable format (e.g 'a week ago')
  timestamp = timeDifference(Date.now(), timestamp);

  // filter currentUser out
  const participants = thread.participants.filter(
    user => user.id !== currentUser.id
  );

  // concat a string of usernames for thread messages
  let participantsArray = participants.length > 1
    ? participants
        .map(user => user.name)
        .join(', ')
        .replace(/,(?!.*,)/gmi, ' and')
    : participants[0].name;

  // pass participants to a helper function to generate the avatar displays
  const avatars = renderAvatars(participants);

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
              <Timestamp>{timestamp}</Timestamp>
            </MessageGroupByline>
            <Meta nowrap>{thread.snippet}</Meta>
          </MessageGroupTextContainer>
        </Row>
      </Link>
    </Wrapper>
  );
};
