// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { Avatar } from '../avatar';
import { Container, Row, Column, Name, Username } from './style';
import { OutlineButton } from '../buttons';

export const ProfileHeader = ({ user }) => {
  return (
    <Container>
      <Row>
        <Avatar size={48} radius={48} src={user.profilePhoto} />
        <Column>
          <Name>
            {user.name}
          </Name>
          <Username>
            @{user.username}
          </Username>
        </Column>
      </Row>

      <Link
        to={`https://spectrum.chat/users/${user.username}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <OutlineButton>View Profile</OutlineButton>
      </Link>
    </Container>
  );
};

export const CommunityProfileHeader = ({ community }) => {
  return (
    <Container>
      <Row>
        <Avatar size={48} radius={8} src={community.profilePhoto} />
        <Column>
          <Name>
            {community.name}
          </Name>
          <Username>
            {community.metaData.members} members
          </Username>
        </Column>
      </Row>

      <Link
        to={`https://spectrum.chat/${community.slug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <OutlineButton>View Profile</OutlineButton>
      </Link>
    </Container>
  );
};

export default ProfileHeader;
