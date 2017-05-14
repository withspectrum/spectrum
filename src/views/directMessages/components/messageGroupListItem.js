//@flow
import React from 'react';
import { Avatar } from '../../../components/avatar';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { timeDifference } from '../../../helpers/utils';
import {
  Wrapper,
  Col,
  Row,
  Heading,
  Meta,
  Description,
  MessageGroupTextContainer,
  MessageGroupByline,
  Usernames,
  Timestamp,
} from './style';

export const ListCardItemDirectMessageGroup = ({
  group,
  children,
}): React$Element<any> => {
  let timestamp = new Date(group.lastActivity).getTime();
  timestamp = timeDifference(Date.now(), timestamp);
  let usersArray = group.users.length > 1
    ? group.users
        .map(user => user.displayName)
        .join(', ')
        .replace(/,(?!.*,)/gmi, ' and')
    : group.users[0].displayName;

  return (
    <Wrapper>
      <Link to={`/messages/${group.id}`}>
        <Row>
          {/* <Avatar
            radius={40}
            src={group.users[0].photoURL}
            size={40}
            style={{ marginRight: '16px' }}
          /> */}
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
