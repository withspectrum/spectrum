// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import truncate from 'shared/truncate';
import Header from './header';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import type { Dispatch } from 'redux';
import {
  InboxThreadItem,
  InboxLinkWrapper,
  InboxThreadContent,
  ThreadTitle,
} from './style';
import ThreadActivity from './activity';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  active: boolean,
  dispatch: Dispatch<Object>,
  hasActiveChannel: ?Object,
  hasActiveCommunity: ?Object,
  history: Object,
  location: Object,
  match: Object,
  staticContext: ?string,
  data: ThreadInfoType,
  viewContext?: ?string,
  currentUser: ?Object,
};

class InboxThread extends React.Component<Props> {
  render() {
    const {
      data,
      location,
      active,
      hasActiveCommunity,
      hasActiveChannel,
      viewContext,
      currentUser,
    } = this.props;

    return (
      <ErrorBoundary fallbackComponent={null}>
        <InboxThreadItem active={active}>
          <InboxLinkWrapper
            to={{
              pathname: location.pathname,
              search:
                // TODO(@mxstbr): Fix this to not use window.innerWidth
                // which breaks SSR rehydration on mobile devices
                window.innerWidth < 768 || viewContext
                  ? `?thread=${data.id}`
                  : `?t=${data.id}`,
            }}
            onClick={e =>
              window.innerWidth > 768 &&
              !viewContext &&
              !e.metaKey &&
              this.props.dispatch(changeActiveThread(data.id))
            }
          />

          <InboxThreadContent>
            <ErrorBoundary fallbackComponent={null}>
              <Header
                thread={data}
                active={active}
                activeCommunity={hasActiveCommunity}
                activeChannel={hasActiveChannel}
              />
            </ErrorBoundary>

            <ThreadTitle active={active}>
              {truncate(data.content.title, 80)}
            </ThreadTitle>

            <ErrorBoundary fallbackComponent={null}>
              <ThreadActivity
                thread={data}
                active={active}
                currentUser={currentUser}
              />
            </ErrorBoundary>
          </InboxThreadContent>
        </InboxThreadItem>
      </ErrorBoundary>
    );
  }
}

const map = (state): * => ({ currentUser: state.users.currentUser });
export default compose(connect(map), withRouter)(InboxThread);
