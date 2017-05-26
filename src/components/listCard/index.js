//@flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';

import { Avatar } from '../avatar';

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
        <ActionContainer className={'action'}>{props.children}</ActionContainer>
      </Row>
      {!!props.contents.description && props.withDescription
        ? <Description>{props.contents.description}</Description>
        : ''}
    </Wrapper>
  );
};

export const ListCardItemUser = ({ user, children }: Object): React$Element<
  any
> => {
  return (
    <Wrapper>
      <Row>
        <Link to={`/users/${user.username}`}>
          <Avatar
            radius={40}
            src={user.profilePhoto}
            size={40}
            style={{ marginRight: '16px' }}
          />
        </Link>
        <Col>
          <Heading>
            <Link to={`/users/${user.username}`}>{user.name}</Link>
          </Heading>
          <Meta>
            <Link to={`/users/${user.username}`}>@{user.username}</Link>
          </Meta>
        </Col>
        <ActionContainer className={'action'}>{children}</ActionContainer>
      </Row>
    </Wrapper>
  );
};
