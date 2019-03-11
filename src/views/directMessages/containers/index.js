// @flow
import * as React from 'react';
import type { Match } from 'react-router';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icons';
import Fab from 'src/components/fab';
import ThreadsList from '../components/threadsList';
import ExistingThread from './existingThread';
import { PrimaryButton } from 'src/views/community/components/button';
import { MobileTitlebar } from 'src/components/titlebar';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
} from 'src/components/layout';
import {
  StyledSecondaryColumn,
  NoCommunitySelected,
  NoCommunityHeading,
  NoCommunitySubheading,
} from '../style';

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
            pathname: '/new/message',
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
                <Link to={'/new/message'}>
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
              {activeThreadId ? (
                <ExistingThread id={activeThreadId} match={match} />
              ) : (
                <NoCommunitySelected>
                  <div>
                    <NoCommunityHeading>
                      No conversation selected
                    </NoCommunityHeading>
                    <NoCommunitySubheading>
                      Choose from an existing conversation, or start a new one.
                    </NoCommunitySubheading>
                    <PrimaryButton
                      to={{
                        pathname: '/new/message',
                        state: { modal: true },
                      }}
                    >
                      New message
                    </PrimaryButton>
                  </div>
                </NoCommunitySelected>
              )}
            </PrimaryColumn>
          </SecondaryPrimaryColumnGrid>
        </ViewGrid>
      </React.Fragment>
    );
  }
}

export default DirectMessages;
