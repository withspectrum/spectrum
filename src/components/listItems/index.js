import * as React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Icon from '../icons';
import Badge from '../badges';
import Avatar from '../avatar';
import { convertTimestampToDate } from '../../helpers/utils';
import Reputation from '../reputation';
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

type CommunityProps = {
  community: {
    profilePhoto: string,
    name: string,
    slug: string,
    description: string,
  },
  showDescription?: boolean,
  showMeta?: boolean,
  meta?: any,
  children?: any,
};

export class CommunityListItem extends React.Component<CommunityProps> {
  render() {
    const { community, showDescription, children, reputation } = this.props;

    return (
      <Wrapper>
        <Row>
          <Avatar
            community={community}
            radius={4}
            src={`${community.profilePhoto}`}
            size={'32'}
            noLink
          />
          <Col style={{ marginLeft: '12px' }}>
            <Heading>{community.name}</Heading>

            {/* greater than -1 because we want to pass the 0 to the component so it returns null */}
            {reputation > -1 && (
              <Meta>
                <Reputation size={'default'} reputation={reputation} />
              </Meta>
            )}
          </Col>
          <ActionContainer className={'action'}>{children}</ActionContainer>
        </Row>
        {showDescription && <Description>{community.description}</Description>}
      </Wrapper>
    );
  }
}

export const ChannelListItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper clickable={props.clickable}>
      <Row>
        <Col>
          <Heading>
            {props.contents.isPrivate ? (
              <Icon glyph={'channel-private'} size={32} />
            ) : (
              <Icon glyph={'channel'} size={32} />
            )}
            {props.contents.name}
          </Heading>
          <Meta>{props.meta && props.meta}</Meta>
        </Col>
        <ActionContainer className={'action'}>{props.children}</ActionContainer>
      </Row>
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
              {props.contents.isPrivate && (
                <Lock>
                  <Icon
                    glyph={'private'}
                    tipText={'Private channel'}
                    tipLocation="top-right"
                    size={16}
                  />
                </Lock>
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
      user.contextPermissions.reputation > 0 &&
      user.contextPermissions.reputation
    : user.totalReputation && user.totalReputation > 0
      ? user.totalReputation
      : '0';

  const role =
    user.contextPermissions && user.contextPermissions.isOwner
      ? 'Admin'
      : user.contextPermissions && user.contextPermissions.isModerator
        ? 'Moderator'
        : null;

  return (
    <Wrapper border>
      <Row>
        <Avatar
          radius={20}
          user={user}
          src={`${user.profilePhoto}`}
          size={'40'}
          link={user.username ? `/users/${user.username}` : null}
        />
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

export const BillingListItem = props => {
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

class InvoiceListItemPure extends React.Component {
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
