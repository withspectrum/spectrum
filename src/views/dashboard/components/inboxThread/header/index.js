// @flow
import * as React from 'react';
import { timeDifferenceShort } from 'shared/time-difference';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import Avatar from 'src/components/avatar';
import {
  Container,
  MetaContainer,
  AuthorAvatarContainer,
  AvatarLink,
  TextRow,
  MetaTitle,
  MetaSubtitle,
  MetaSubtitlePinned,
  MetaSubtitleLocked,
  MetaSubtitleWatercooler,
  MetaSubtitleText,
  Divider,
} from './style';

type Props = {
  thread: GetThreadType,
  active: boolean,
  activeCommunity: ?Object,
  activeChannel: ?Object,
};

class Header extends React.Component<Props> {
  render() {
    const {
      thread: {
        community,
        channel,
        lastActive,
        createdAt,
        author,
        id,
        isLocked,
        watercooler,
      },
      active,
      activeCommunity,
      activeChannel,
    } = this.props;

    const now = new Date().getTime();
    const then = lastActive || createdAt;
    const timestamp = timeDifferenceShort(now, new Date(then).getTime());

    const isPinned = id === community.pinnedThreadId;

    return (
      <Container active={active}>
        {!activeCommunity &&
          !activeChannel && (
            <AvatarLink to={`/${community.slug}`}>
              <Avatar
                community={community}
                src={`${community.profilePhoto}`}
                size={'32'}
              />
            </AvatarLink>
          )}

        <MetaContainer>
          {(!activeCommunity || !activeChannel) && (
            <TextRow>
              {!activeCommunity &&
                !activeChannel && (
                  <MetaTitle active={active} to={`/${community.slug}`}>
                    {community.name}
                  </MetaTitle>
                )}

              {!activeChannel && (
                <MetaSubtitle
                  active={active}
                  to={`/${community.slug}/${channel.slug}`}
                >
                  {!activeCommunity && <Divider>{' · '}</Divider>}
                  {channel.name}
                </MetaSubtitle>
              )}
            </TextRow>
          )}

          <TextRow>
            {activeChannel && (
              <AuthorAvatarContainer>
                <Avatar
                  src={author.user.profilePhoto}
                  size={'16'}
                  user={author.user}
                  link={
                    author.user.username && `/users/${author.user.username}`
                  }
                />
              </AuthorAvatarContainer>
            )}

            {author.user.username ? (
              <MetaSubtitle
                active={active}
                to={`/users/${author.user.username}`}
              >
                {author.user.name}
              </MetaSubtitle>
            ) : (
              <MetaSubtitleText active={active}>
                {author.user.name}
              </MetaSubtitleText>
            )}

            <MetaSubtitleText active={active}>
              <Divider>{' · '}</Divider>
              {timestamp}
            </MetaSubtitleText>

            {watercooler && (
              <MetaSubtitleWatercooler active={active}>
                <Divider>{' · '}</Divider>
                Watercooler
              </MetaSubtitleWatercooler>
            )}

            {isLocked && (
              <MetaSubtitleLocked active={active}>
                <Divider>{' · '}</Divider>
                Locked
              </MetaSubtitleLocked>
            )}

            {isPinned && (
              <MetaSubtitlePinned active={active}>
                <Divider>{' · '}</Divider>
                Pinned
              </MetaSubtitlePinned>
            )}
          </TextRow>
        </MetaContainer>
      </Container>
    );
  }
}

export default Header;
