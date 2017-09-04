//@flow
import React, { Component } from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import StripeCheckout from 'react-stripe-checkout';
import Icon from '../icons';
import Badge from '../badges';
import { Avatar } from '../avatar';
import { Button } from '../buttons';
import { convertTimestampToDate } from '../../helpers/utils';
import { PUBLIC_STRIPE_KEY } from '../../api';
import { addToastWithTimeout } from '../../actions/toasts';
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
          community
          radius={4}
          src={`${props.contents.profilePhoto}`}
          size={32}
          noLink
        />
        <Col style={{ marginLeft: '12px' }}>
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
          link={user.username ? `/users/${user.username}` : null}
        />
        <Col style={{ marginLeft: '16px' }}>
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
          {props.badge &&
            <BadgeContainer>
              <Badge type={props.badge || 'pro'} />
            </BadgeContainer>}
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

class InvoiceListItemPure extends Component {
  render() {
    const { invoice } = this.props;

    return (
      <WrapperLi>
        <Row>
          <Col>
            <Heading>
              ${(invoice.amount / 100)
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
            </Heading>
            <Meta>
              {invoice.paidAt
                ? `Paid on ${convertTimestampToDate(invoice.paidAt * 1000)}`
                : 'Unpaid'}{' '}
              · {invoice.sourceBrand} {invoice.sourceLast4}
            </Meta>
          </Col>
        </Row>
      </WrapperLi>
    );
  }
}

export const InvoiceListItem = compose(pure, connect())(InvoiceListItemPure);
