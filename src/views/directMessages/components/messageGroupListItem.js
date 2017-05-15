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

export const ListCardItemDirectMessageGroup = ({
  group,
  children,
  currentUser,
}) => {
  // convert the server time to an iso timestamp
  let timestamp = new Date(group.lastActivity).getTime();
  // get the difference in a readable format (e.g 'a week ago')
  timestamp = timeDifference(Date.now(), timestamp);

  // filter currentUser out
  const users = group.users.filter(user => user.uid !== currentUser.uid);

  // concat a string of usernames for group messages
  let usersArray = users.length > 1
    ? users
        .map(user => user.displayName)
        .join(', ')
        .replace(/,(?!.*,)/gmi, ' and')
    : users[0].displayName;

  // pass users to a helper function to generate the avatar displays
  const avatars = renderAvatars(users);

  return (
    <Wrapper>
      <Link to={`/messages/${group.id}`}>
        <Row>
          {avatars}
          <MessageGroupTextContainer>
            <MessageGroupByline>
              <Usernames>
                <p>{usersArray}</p>
              </Usernames>
              <Timestamp>{timestamp}</Timestamp>
            </MessageGroupByline>
            <Meta nowrap>{group.snippet}</Meta>
          </MessageGroupTextContainer>
        </Row>
      </Link>
    </Wrapper>
  );
};
