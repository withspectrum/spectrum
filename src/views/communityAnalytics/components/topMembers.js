import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Icon from '../../../components/icons';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Loading } from '../../../components/loading';
import ViewError from '../../../components/viewError';
import { UserListItem } from '../../../components/listItems';
import {
  SectionCard,
  SectionTitle,
  MessageIcon,
} from '../../communitySettings/style';
import { getCommunityTopMembers } from '../queries';

type User = {
  id: string,
  profilePhoto: string,
  name: string,
  username: string,
};

type Props = {
  isLoading: boolean,
  data: {
    community: {
      topMembers: Array<User>,
    },
  },
};

class ConversationGrowth extends React.Component<Props> {
  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    this.props.history.push('/messages/new');
  };

  render() {
    const { data: { community }, isLoading } = this.props;

    if (community && community.topMembers.length > 0) {
      const sortedTopMembers = community.topMembers.slice().sort((a, b) => {
        const bc = parseInt(b.contextPermissions.reputation, 10);
        const ac = parseInt(a.contextPermissions.reputation, 10);
        return bc <= ac ? -1 : 1;
      });
      return (
        <SectionCard>
          <SectionTitle>Top members this week</SectionTitle>
          {sortedTopMembers.map(user => {
            return (
              <UserListItem key={user.id} user={user}>
                <MessageIcon
                  tipText={`Message ${user.name}`}
                  tipLocation={'top-left'}
                  onClick={() => this.initMessage(user)}
                >
                  <Icon glyph="message-new" size={32} />
                </MessageIcon>
              </UserListItem>
            );
          })}
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <SectionTitle>Top members this week</SectionTitle>
        <ViewError
          small
          emoji={'😭'}
          heading={`Your community has been quiet this week`}
          subheading={`When people are posting new threads and joining conversations, the most active people will appear here.`}
        />
      </SectionCard>
    );
  }
}

export default compose(
  connect(),
  withRouter,
  getCommunityTopMembers,
  viewNetworkHandler
)(ConversationGrowth);
