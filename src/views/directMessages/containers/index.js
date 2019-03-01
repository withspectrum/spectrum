// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import type { Match } from 'react-router';
import Icon from 'src/components/icons';
import ThreadsList from '../components/threadsList';
import NewThread from './newThread';
import ExistingThread from './existingThread';
import Titlebar from 'src/views/titlebar';
import { View, MessagesList, ComposeHeader } from '../style';
import { track, events } from 'src/helpers/analytics';

type Props = {
  match: Match,
};

type State = {
  activeThreadId: string,
};

class DirectMessages extends React.Component<Props, State> {
  componentDidUpdate(prevProps: Props) {
    const curr = this.props;
    if (prevProps.match.params.threadId !== curr.match.params.threadId) {
      if (curr.match.params.threadId === 'new') {
        track(events.DIRECT_MESSAGE_THREAD_COMPOSER_VIEWED);
      } else {
        track(events.DIRECT_MESSAGE_THREAD_VIEWED);
      }
    }
  }

  render() {
    const { match } = this.props;

    const activeThreadId = match.params.threadId;
    const isComposing = activeThreadId === 'new';
    const isViewingThread = !isComposing && !!activeThreadId;

    return (
      <View>
        <Titlebar
          title={isComposing ? 'New Message' : 'Messages'}
          provideBack={isComposing || isViewingThread}
          backRoute={'/messages'}
          noComposer={isComposing || isViewingThread}
          messageComposer={!isComposing && !isViewingThread}
        />

        <MessagesList isViewingThread={isViewingThread || isComposing}>
          <Link to="/messages/new">
            <ComposeHeader>
              <Icon glyph="message-new" dataCy="compose-dm" />
            </ComposeHeader>
          </Link>

          <ThreadsList activeThreadId={activeThreadId} />
        </MessagesList>

        {isViewingThread ? (
          <ExistingThread
            id={activeThreadId}
            match={match}
            hideOnMobile={isComposing}
          />
        ) : (
          <NewThread
            match={match}
            hideOnMobile={isViewingThread || !activeThreadId}
          />
        )}
      </View>
    );
  }
}

export default DirectMessages;
