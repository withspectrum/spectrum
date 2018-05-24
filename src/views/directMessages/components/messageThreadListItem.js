import React, { Component } from 'react';
// $FlowFixMe
import Link from 'src/components/link';
import { timeDifference } from 'shared/time-difference';
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

class ListCardItemDirectMessageThread extends Component {
  render() {
    const { thread, currentUser, active } = this.props;

    // convert the server time to an iso timestamp
    const timestamp = new Date(thread.threadLastActive).getTime();

    // get the difference in a readable format (e.g 'a week ago')
    const threadTimeDifference = timeDifference(Date.now(), timestamp);

    // filter currentUser out
    const participants = thread.participants.filter(
      user => user.userId !== currentUser.id
    );
    // concat a string of users' names for thread messages
    let participantsArray =
      participants.length > 1
        ? participants
            .map(user => user.name)
            .join(', ')
            .replace(/,(?!.*,)/gim, ' and')
        : participants[0].name;
    // pass participants to a helper function to generate the avatar displays
    const avatars = renderAvatars(participants);

    const currentParticipant = thread.participants.filter(
      user => user.userId === currentUser.id
    )[0];

    const currentParticipantLastActiveTimestamp = new Date(
      currentParticipant.lastSeen
    ).getTime();

    let isUnread = currentParticipantLastActiveTimestamp < timestamp;
    isUnread = active ? false : isUnread;

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
                <Timestamp isUnread={isUnread}>
                  {threadTimeDifference}
                </Timestamp>
              </MessageGroupByline>
              <Meta isUnread={isUnread} nowrap>
                {thread.snippet}
              </Meta>
            </MessageGroupTextContainer>
          </Row>
        </Link>
      </Wrapper>
    );
  }
}

export default ListCardItemDirectMessageThread;
