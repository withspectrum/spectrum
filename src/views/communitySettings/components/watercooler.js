// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  getCommunityById,
  type GetCommunityType,
} from 'shared/graphql/queries/community/getCommunity';
import { Loading } from 'src/components/loading';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { Link } from 'react-router-dom';
import { Button, OutlineButton } from 'src/components/buttons';
import { TextArea, Error } from 'src/components/formElements';
import enableCommunityWatercooler from 'shared/graphql/mutations/community/enableCommunityWatercooler';
import getThreadLink from 'src/helpers/get-thread-link';
import { addToastWithTimeout } from '../../../actions/toasts';
import type { Dispatch } from 'redux';
import type { History } from 'react-router';

type Props = {
  data: {
    community: GetCommunityType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  enableCommunityWatercooler: Function,
  dispatch: Dispatch<Object>,
  history: History,
};

const Watercooler = (props: Props) => {
  // $FlowIssue
  const [saving, setSaving] = React.useState(false);
  const {
    data: { community },
    isLoading,
  } = props;

  const onClick = () => {
    setSaving(true);
    const method = community.watercoolerId
      ? ({ id }) => Promise.resolve()
      : props.enableCommunityWatercooler;
    method({
      id: community.id,
    }).then(({ data }) => {
      setSaving(false);
      const watercoolerId = data.enableCommunityWatercooler
        ? data.enableCommunityWatercooler.watercoolerId
        : data.disableCommunityWatercooler.id;
      props.history.push({
        // $FlowIssue we are faking full thread info here
        pathname: getThreadLink({
          id: watercoolerId,
          content: {
            title: `${community.name} watercooler`,
          },
          community: {
            slug: community.slug,
          },
          channel: {
            slug: 'general',
          },
        }),
        state: { modal: true },
      });
    });
  };

  if (community) {
    return (
      <SectionCard data-cy="community-settings-branded-login">
        <SectionTitle>Open Chat</SectionTitle>
        <SectionSubtitle>
          Display an open chat feed on your community's profile.
        </SectionSubtitle>
        <SectionCardFooter>
          <Button loading={saving} onClick={onClick} type="submit">
            {community.watercoolerId ? 'Disable' : 'Enable'}
          </Button>
        </SectionCardFooter>
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

  return null;
};

export default compose(
  getCommunityById,
  viewNetworkHandler,
  enableCommunityWatercooler,
  withRouter,
  connect()
)(Watercooler);
