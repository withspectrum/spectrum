//@flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../icons';
import Badge from '../badges';
import { Avatar } from '../avatar';

import {
  Wrapper,
  Col,
  Row,
  Heading,
  Meta,
  Description,
  ActionContainer,
  BadgeContainer,
  ChannelTypeIndicator,
} from './style';

type CardProps = {
  contents: {
    name: string,
    description?: string,
  },
  children?: React$Element<any>,
  meta?: string,
};

export const CommunityListItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper>
      <Row>
        <Avatar
          radius={4}
          src={`${props.contents.profilePhoto}`}
          size={32}
          style={{ marginRight: '12px' }}
        />
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

export const ChannelListItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper clickable={props.clickable}>
      <Row>
        <ChannelTypeIndicator>
          {props.contents.isPrivate
            ? <Icon
                glyph="private"
                tipText={'Private channel'}
                tipLocation="top-right"
              />
            : <Icon
                glyph="channel"
                tipText={'Channel'}
                tipLocation="top-right"
              />}
        </ChannelTypeIndicator>
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

export const UserListItem = ({ user, children }: Object): React$Element<
  any
> => {
  return (
    <Wrapper>
      <Row>
        {user.username
          ? <Link to={`/users/${user.username}`}>
              <Avatar
                radius={20}
                src={`${user.profilePhoto}`}
                size={40}
                style={{ marginRight: '16px' }}
              />
            </Link>
          : <Avatar
              radius={20}
              src={`${user.profilePhoto}`}
              size={40}
              style={{ marginRight: '16px' }}
            />}
        <Col>
          <Heading>
            {user.username
              ? <Link to={`/users/${user.username}`}>{user.name}</Link>
              : <span>{user.name}</span>}
          </Heading>
          <Meta>
            {user.username
              ? <Link to={`/users/${user.username}`}>@{user.username}</Link>
              : ''}
          </Meta>
        </Col>
        <ActionContainer className={'action'}>{children}</ActionContainer>
      </Row>
    </Wrapper>
  );
};

export const BillingListItem = props => {
  return (
    <div>
      <Wrapper>
        <Row>
          <BadgeContainer>
            <Badge type="pro" />
          </BadgeContainer>
          <Col>
            <Heading>{props.contents.name}</Heading>
            <Meta>{props.meta}</Meta>
          </Col>
          <ActionContainer className={'action'}>
            {props.children}
          </ActionContainer>
        </Row>
        {!!props.contents.description && props.withDescription
          ? <Description>{props.contents.description}</Description>
          : ''}
      </Wrapper>
    </div>
  );
};
