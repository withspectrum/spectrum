// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { parseActors, parseEvent, parseNotificationDate } from '../utils';
import { ActorsRow } from './actorsRow';
import approvePendingCommunityMember from 'shared/graphql/mutations/communityMember/approvePendingCommunityMember';
import blockPendingCommunityMember from 'shared/graphql/mutations/communityMember/blockPendingCommunityMember';
import { Button, OutlineButton } from 'src/components/button';
import {
  SegmentedNotificationCard,
  TextContent,
  RequestContext,
  Content,
  ContentWash,
  AttachmentsWash,
  ButtonsRow,
} from '../style';
import Icon from 'src/components/icon';
import { CardContent } from 'src/components/threadFeedCard/style';
import compose from 'recompose/compose';
import MutationWrapper from 'src/views/communityMembers/components/mutationWrapper';
import GetCommunityMember from './getCommunityMember';

type Props = {
  notification: Object,
  currentUser: Object,
  markSingleNotificationSeen: Function,
  approvePendingCommunityMember: Function,
  blockPendingCommunityMember: Function,
};

class PrivateCommunityRequestSentComponent extends React.Component<Props> {
  render() {
    const {
      notification,
      currentUser,
      approvePendingCommunityMember,
      blockPendingCommunityMember,
      markSingleNotificationSeen,
    } = this.props;

    const actors = parseActors(notification.actors, currentUser, true);
    const event = parseEvent(notification.event);
    const date = parseNotificationDate(notification.modifiedAt);

    const input = {
      communityId: notification.context.id,
      userId: notification.actors[0].id,
    };

    return (
      <SegmentedNotificationCard
        onClick={() => markSingleNotificationSeen(notification.id)}
        isSeen={notification.isSeen}
      >
        <Link
          to={`/${
            notification.context.payload.slug
          }/settings/members?filter=pending`}
        >
          <CardContent>
            <RequestContext style={{ padding: '0 16px' }}>
              <Icon glyph="person" />
              <ActorsRow actors={actors.asObjects} />
            </RequestContext>
          </CardContent>
          <Content style={{ padding: '0 16px 16px' }}>
            <TextContent pointer={false}>
              {' '}
              {actors.asString} {event} the{' '}
              <Link to={`/${notification.context.payload.slug}`}>
                {notification.context.payload.name}
              </Link>{' '}
              community {date}{' '}
            </TextContent>
          </Content>
        </Link>
        <GetCommunityMember
          userId={input.userId}
          communityId={input.communityId}
          render={({ communityMember }) => {
            if (!communityMember || !communityMember.isPending) return null;
            return (
              <ContentWash>
                <AttachmentsWash>
                  <ButtonsRow>
                    <MutationWrapper
                      mutation={blockPendingCommunityMember}
                      variables={{ input: input }}
                      render={({ isLoading }) => (
                        <OutlineButton loading={isLoading} glyph={'minus'}>
                          Block
                        </OutlineButton>
                      )}
                    />
                    <MutationWrapper
                      mutation={approvePendingCommunityMember}
                      variables={{ input: input }}
                      render={({ isLoading }) => (
                        <Button loading={isLoading} glyph={'plus'}>
                          Approve
                        </Button>
                      )}
                    />
                  </ButtonsRow>
                </AttachmentsWash>
              </ContentWash>
            );
          }}
        />
      </SegmentedNotificationCard>
    );
  }
}

export const PrivateCommunityRequestSent = compose(
  approvePendingCommunityMember,
  blockPendingCommunityMember
)(PrivateCommunityRequestSentComponent);
