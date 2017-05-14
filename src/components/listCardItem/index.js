//@flow
import React from 'react';
import { Avatar } from '../avatar';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  Wrapper,
  Col,
  Row,
  Heading,
  Meta,
  Description,
  ActionContainer,
} from './style';

type CardProps = {
  contents: {
    name: string,
    description?: string,
  },
  children?: React$Element<any>,
  meta?: string,
};

export const ListCardItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper>
      <Row>
        <Col>
          <Heading>{props.contents.name}</Heading>
          <Meta>{props.meta}</Meta>
        </Col>
        <ActionContainer>{props.children}</ActionContainer>
      </Row>
      {!!props.contents.description && props.withDescription
        ? <Description>{props.contents.description}</Description>
        : ''}
    </Wrapper>
  );
};

export const ListCardItemUser = ({ user, children }): React$Element<any> => {
  return (
    <Wrapper>
      <Row>
        <Link to={`/users/${user.username}`}>
          <Avatar
            radius={40}
            src={user.photoURL}
            size={40}
            style={{ marginRight: '16px' }}
          />
        </Link>
        <Col>
          <Heading>
            <Link to={`/users/${user.username}`}>{user.displayName}</Link>
          </Heading>
          <Meta>
            <Link to={`/users/${user.username}`}>@{user.username}</Link>
          </Meta>
        </Col>
        <ActionContainer>{children}</ActionContainer>
      </Row>
    </Wrapper>
  );
};
