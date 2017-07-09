//@flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../icons';
import Badge from '../badges';
import { Avatar } from '../avatar';

import {
  Wrapper,
  WrapperLi,
  Col,
  Row,
  Heading,
  Meta,
  Description,
  ActionContainer,
  BadgeContainer,
  Lock,
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
          link={`/${props.contents.slug}`}
          src={`${props.contents.profilePhoto}`}
          size={32}
          style={{ marginRight: '12px' }}
        />
        <Col>
          <Heading>
            {props.contents.name}
          </Heading>
          <Meta>
            {props.meta}
          </Meta>
        </Col>
        <ActionContainer className={'action'}>
          {props.children}
        </ActionContainer>
      </Row>
      {!!props.contents.description && props.withDescription
        ? <Description>
            {props.contents.description}
          </Description>
        : ''}
    </Wrapper>
  );
};

export const ChannelListItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper clickable={props.clickable}>
      <Row>
        <Col>
          <Link to={`/${props.contents.community.slug}/${props.contents.slug}`}>
            <Heading>
              {props.contents.isPrivate &&
                <Lock>
                  <Icon
                    glyph={'private'}
                    tipText={'Private channel'}
                    tipLocation="top-right"
                    size={16}
                  />
                </Lock>}
              {props.contents.name}
            </Heading>
          </Link>
          <Meta>
            {props.meta}
          </Meta>
        </Col>
        <ActionContainer className={'action'}>
          {props.children}
        </ActionContainer>
      </Row>
      {!!props.contents.description && props.withDescription
        ? <Description>
            {props.contents.description}
          </Description>
        : ''}
    </Wrapper>
  );
};

export const ThreadListItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper clickable={props.clickable}>
      <Row>
        <Col>
          <Heading>
            {props.contents.content.title}
          </Heading>
          <Meta>
            {props.meta}
          </Meta>
        </Col>
      </Row>
    </Wrapper>
  );
};

export const ChannelListItemLi = (props: CardProps): React$Element<any> => {
  return (
    <WrapperLi clickable={props.clickable}>
      <Row>
        <Col>
          <Link to={`/${props.contents.community.slug}/${props.contents.slug}`}>
            <Heading>
              {props.contents.isPrivate &&
                <Lock>
                  <Icon
                    glyph={'private'}
                    tipText={'Private channel'}
                    tipLocation="top-right"
                    size={16}
                  />
                </Lock>}
              {props.contents.name}
            </Heading>
          </Link>
          <Meta>
            {props.meta}
          </Meta>
        </Col>
        <ActionContainer className={'action'}>
          {props.children}
        </ActionContainer>
      </Row>
      {!!props.contents.description && props.withDescription
        ? <Description>
            {props.contents.description}
          </Description>
        : ''}
    </WrapperLi>
  );
};

export const UserListItem = ({
  user,
  children,
}: Object): React$Element<any> => {
  return (
    <Wrapper>
      <Row>
        <Avatar
          radius={20}
          src={`${user.profilePhoto}`}
          size={40}
          style={{ marginRight: '16px' }}
          link={user.username ? `/users/${user.username}` : null}
        />
        <Col>
          <Heading>
            {user.username
              ? <Link to={`/users/${user.username}`}>
                  {user.name}
                </Link>
              : <span>
                  {user.name}
                </span>}
          </Heading>
          {user.username &&
            <Meta>
              <Link to={`/users/${user.username}`}>
                @{user.username}
              </Link>
            </Meta>}
        </Col>
        <ActionContainer className={'action'}>
          {children}
        </ActionContainer>
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
            <Heading>
              {props.contents.name}
            </Heading>
            <Meta>
              {props.meta}
            </Meta>
          </Col>
          <ActionContainer className={'action'}>
            {props.children}
          </ActionContainer>
        </Row>
        {!!props.contents.description && props.withDescription
          ? <Description>
              {props.contents.description}
            </Description>
          : ''}
      </Wrapper>
    </div>
  );
};
