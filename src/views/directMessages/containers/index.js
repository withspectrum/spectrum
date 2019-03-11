// @flow
import * as React from 'react';
import type { Match } from 'react-router';
import Icon from 'src/components/icons';
import Fab from 'src/components/fab';
import ThreadsList from '../components/threadsList';
import ExistingThread from './existingThread';
import { Link } from 'react-router-dom';
import { MobileTitlebar } from 'src/components/titlebar';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
} from 'src/components/layout';
import { StyledSecondaryColumn } from '../style';

type Props = {
  match: Match,
};

type State = {
  activeThreadId: string,
};

class DirectMessages extends React.Component<Props, State> {
  render() {
    const { match } = this.props;
    const activeThreadId = match.params.threadId;

    return (
      <React.Fragment>
        <Fab
          title="New message"
          to={{
            pathname: '/messages/new',
            state: { modal: true },
          }}
        >
          <Icon glyph={'message-simple-new'} size={32} />
        </Fab>

        <ViewGrid>
          {!activeThreadId && (
            <MobileTitlebar
              title="Messages"
              menuAction="menu"
              rightAction={
                <Link to={'/messages/new'}>
                  <Icon glyph={'message-simple-new'} />
                </Link>
              }
            />
          )}
          <SecondaryPrimaryColumnGrid>
            <StyledSecondaryColumn shouldHideThreadList={!!activeThreadId}>
              <ThreadsList activeThreadId={activeThreadId} />
            </StyledSecondaryColumn>

            <PrimaryColumn>
              {!!activeThreadId && (
                <ExistingThread id={activeThreadId} match={match} />
              )}
            </PrimaryColumn>
          </SecondaryPrimaryColumnGrid>
        </ViewGrid>
      </React.Fragment>
    );
  }
}

export default DirectMessages;
