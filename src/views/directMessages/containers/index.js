// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Match } from 'react-router';
import ThreadsList from '../components/threadsList';
import ExistingThread from './existingThread';
import {
  PrimaryButton,
  SmallPrimaryButton,
} from 'src/views/community/components/button';
import { setTitlebarProps } from 'src/actions/titlebar';
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
  dispatch: Dispatch<Object>,
};

type State = {
  activeThreadId: string,
};

class DirectMessages extends React.Component<Props, State> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      setTitlebarProps({
        title: 'Messages',
        rightAction: (
          <SmallPrimaryButton to={'/new/message'}>New</SmallPrimaryButton>
        ),
      })
    );
  }

  componentDidUpdate() {
    const { match, dispatch } = this.props;
    const { params } = match;
    if (!params.threadId) {
      dispatch(
        setTitlebarProps({
          title: 'Messages',
          rightAction: (
            <SmallPrimaryButton to={'/new/message'}>New</SmallPrimaryButton>
          ),
        })
      );
    }
  }

  render() {
    const { match } = this.props;
    const activeThreadId = match.params.threadId;

    return (
      <ViewGrid>
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
    );
  }
}

export default connect()(DirectMessages);
