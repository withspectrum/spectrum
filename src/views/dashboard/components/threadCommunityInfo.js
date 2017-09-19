// @flow
import React from 'react';
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 16px 0;
`;

const AvatarLink = styled(Link)`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  box-shadow: 0 0 0 1px ${props => props.theme.border.default};
  border-radius: 4px;
  overflow: hidden;
`;

const CommunityAvatar = styled.img`
  width: 100%;
  height: 100%;
`;

const CommunityLink = styled(Link)`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  line-height: 1.28;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

const PillLink = styled(Link)`
  display: inline-block;
  height: 20px;
  box-shadow: 0 0 0 1px ${props => props.theme.border.default};
  border-radius: 4px;
  overflow: hidden;
  padding: 4px 8px;
  background: ${props => props.theme.bg.wash};
  font-size: 12px;
  font-weight: 400;
  max-height: 24px;
  line-height: 1;
  color: ${props => props.theme.text.alt};

  &:hover {
    color: ${props => props.theme.text.default};
    background: ${props => props.theme.bg.reverse};
  }
`;

export default ({ thread }) => {
  const { channel } = thread;
  const isGeneral = channel.slug === 'general';
  return (
    <Container>
      <AvatarLink to={`/${channel.community.slug}`}>
        <CommunityAvatar src={`${channel.community.profilePhoto}?w=20`} />
      </AvatarLink>
      {isGeneral ? (
        <CommunityLink to={`/${channel.community.slug}`}>
          {channel.community.name}
        </CommunityLink>
      ) : (
        <PillLink to={`/${channel.community.slug}/${channel.slug}`}>
          {channel.name}
        </PillLink>
      )}
    </Container>
  );
};
