// @flow
import * as React from 'react';
import { timeDifference } from 'shared/time-difference';
import { renderAvatars } from './avatars';
import type { GetDirectMessageThreadType } from 'shared/graphql/queries/directMessageThread/getDirectMessageThread';
import {
  Wrapper,
  WrapperLink,
  Row,
  Meta,
  MessageGroupTextContainer,
  MessageGroupByline,
  Usernames,
  Timestamp,
} from './style';

type Props = {
  active: boolean,
  currentUser: Object,
  thread: GetDirectMessageThreadType,
};

class ListCardItemDirectMessageThread extends React.Component<Props> {
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

    return (
      <Wrapper active={active}>
        <WrapperLink to={`/messages/${thread.id}`}>
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
        </WrapperLink>
      </Wrapper>
    );
  }
}

export default ListCardItemDirectMessageThread;
