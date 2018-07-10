// @flow
import * as React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Icon from 'src/components/icons';
import Badge from 'src/components/badges';
import { UserAvatar, CommunityAvatar } from 'src/components/avatar';
import {
  CommunityHoverProfile,
  ChannelHoverProfile,
} from 'src/components/hoverProfile';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import type { InvoiceInfoType } from 'shared/graphql/fragments/invoice/invoiceInfo';
import { convertTimestampToDate } from 'shared/time-formatting';
import Reputation from 'src/components/reputation';
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
} from './style';

type CommunityProps = {
  community: CommunityInfoType,
  showDescription?: boolean,
  showMeta?: boolean,
  meta?: any,
  children?: any,
  reputation?: number,
  showHoverProfile?: boolean,
};

export class CommunityListItem extends React.Component<CommunityProps> {
  render() {
    const { community, showDescription, children, reputation } = this.props;

    return (
      <Wrapper>
        <CommunityHoverProfile id={community.id} style={{ flex: '1 0 auto' }}>
          <Row>
            <CommunityAvatar
              community={community}
              size={32}
              showHoverProfile={false}
            />
            <Col style={{ marginLeft: '12px' }}>
              <Heading>{community.name}</Heading>
              {/* greater than -1 because we want to pass the 0 to the component so it returns null */}
              {typeof reputation === 'number' &&
                reputation > -1 && (
                  <Meta>
                    <Reputation size={'default'} reputation={reputation} />
                  </Meta>
                )}
            </Col>
            <ActionContainer className={'action'}>{children}</ActionContainer>
          </Row>
          {showDescription && (
            <Description>{community.description}</Description>
          )}
        </CommunityHoverProfile>
      </Wrapper>
    );
  }
}

type CardProps = {
  clickable?: boolean,
  contents: any,
  meta?: string,
  children?: any,
};

export const ChannelListItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper clickable={props.clickable}>
      <ChannelHoverProfile id={props.contents.id} style={{ flex: '1 0 auto' }}>
        <Row>
          <Col>
            <Heading>
              {props.contents.isPrivate ? (
                <Icon glyph={'channel-private'} size={32} />
              ) : (
                <Icon glyph={'channel'} size={32} />
              )}
              {props.contents.name}
              {props.contents.isArchived && ' (Archived)'}
            </Heading>
            <Meta>{props.meta && props.meta}</Meta>
          </Col>
          <ActionContainer className={'action'}>
            {props.children}
          </ActionContainer>
        </Row>
      </ChannelHoverProfile>
    </Wrapper>
  );
};

export const ThreadListItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper clickable={props.clickable}>
      <Row>
        <Col>
          <Heading>{props.contents.content.title}</Heading>
          <Meta>{props.meta}</Meta>
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
              {props.contents.isPrivate ? (
                <Icon glyph={'channel-private'} size={32} />
              ) : (
                <Icon glyph={'channel'} size={32} />
              )}
              {props.contents.name}
            </Heading>
          </Link>
          <Meta>{props.meta}</Meta>
        </Col>
        <ActionContainer className={'action'}>{props.children}</ActionContainer>
      </Row>
    </WrapperLi>
  );
};

export const UserListItem = ({
  user,
  children,
  hideRep = false,
}: Object): React$Element<any> => {
  const reputation = user.contextPermissions
    ? user.contextPermissions.reputation &&
      typeof user.contextPermissions.reputation === 'number'
      ? user.contextPermissions.reputation
      : 0
    : user.reputation && typeof user.reputation === 'number'
      ? user.reputation
      : user.totalReputation && typeof user.totalReputation === 'number'
        ? user.totalReputation
        : 0;

  const role =
    user.contextPermissions && user.contextPermissions.isOwner
      ? 'Admin'
      : user.contextPermissions && user.contextPermissions.isModerator
        ? 'Moderator'
        : null;

  return (
    <Wrapper border>
      <Row>
        <UserAvatar user={user} size={40} />
        <Col
          style={{
            marginLeft: '16px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Heading>
            {user.username ? (
              <Link to={`/users/${user.username}`}>{user.name}</Link>
            ) : (
              <span>{user.name}</span>
            )}
            {role && <Badge type={role} />}
          </Heading>
          {!hideRep && (
            <Meta>
              {(user.totalReputation || user.contextPermissions) && (
                <Reputation reputation={reputation} />
              )}
            </Meta>
          )}
        </Col>
        <ActionContainer className={'action'}>{children}</ActionContainer>
      </Row>
    </Wrapper>
  );
};

type BillingProps = {
  meta: string,
  contents: any,
  children?: any,
  badge?: string,
  withDescription: boolean,
};

export const BillingListItem = (props: BillingProps) => {
  return (
    <div>
      <Wrapper>
        <Row>
          {props.badge && (
            <BadgeContainer>
              <Badge type={props.badge || 'pro'} />
            </BadgeContainer>
          )}
          <Col>
            <Heading>{props.contents.name}</Heading>
            <Meta>{props.meta}</Meta>
          </Col>
          <ActionContainer className={'action'}>
            {props.children}
          </ActionContainer>
        </Row>
        {!!props.contents.description && props.withDescription ? (
          <Description>{props.contents.description}</Description>
        ) : (
          ''
        )}
      </Wrapper>
    </div>
  );
};

type InvoiceProps = {
  invoice: InvoiceInfoType,
};

class InvoiceListItemPure extends React.Component<InvoiceProps> {
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

export const InvoiceListItem = compose(connect())(InvoiceListItemPure);
