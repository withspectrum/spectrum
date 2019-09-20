// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import Badge from 'src/components/badges';
import { UserAvatar, CommunityAvatar } from 'src/components/avatar';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import Reputation from 'src/components/reputation';
import ChannelComponent from './channel';
import {
  Wrapper,
  Col,
  Row,
  Heading,
  Meta,
  Description,
  ActionContainer,
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
        <Row>
          <CommunityAvatar
            community={community}
            size={32}
            showHoverProfile={false}
            isClickable={false}
          />
          <Col style={{ marginLeft: '12px' }}>
            <Heading>{community.name}</Heading>
            {/* greater than -1 because we want to pass the 0 to the component so it returns null */}
            {typeof reputation === 'number' && reputation > -1 && (
              <Meta>
                {/* $FlowIssue */}
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

type CardProps = {
  isClickable?: boolean,
  contents: any,
  meta?: string,
  children?: any,
};

export const ThreadListItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper isClickable={props.isClickable}>
      <Row>
        <Col>
          <Heading>{props.contents.content.title}</Heading>
          <Meta>{props.meta}</Meta>
        </Col>
      </Row>
    </Wrapper>
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
                /* $FlowIssue */
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

export const ChannelListItem = ChannelComponent;
