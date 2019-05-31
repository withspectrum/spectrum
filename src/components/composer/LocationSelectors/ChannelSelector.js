// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import type { Location } from 'react-router';
import querystring from 'query-string';
import getCommunityChannelConnection, {
  type GetCommunityChannelConnectionType,
} from 'shared/graphql/queries/community/getCommunityChannelConnection';
import { LoadingSelect, ErrorSelect } from 'src/components/loading';
import Icon from 'src/components/icon';
import { sortChannels } from '../utils';
import { RequiredSelector, ChannelPreview } from '../style';

type Props = {
  id: string,
  selectedChannelId: ?string,
  selectedCommunityId: ?string,
  onChannelChange: Function,
  location: Location,
  className?: string,
  data: {
    loading: boolean,
    error: ?string,
    community: ?GetCommunityChannelConnectionType,
  },
};

const ChannelSelector = (props: Props) => {
  const {
    data,
    onChannelChange,
    selectedChannelId,
    selectedCommunityId,
    location,
    className,
    ...rest
  } = props;
  const { loading, error, community } = data;
  if (loading) return <LoadingSelect />;
  if (error)
    return <ErrorSelect>Something went wrong, try refreshing</ErrorSelect>;

  const onChange = (evt: any) => onChannelChange(evt.target.value);

  const { search } = location;
  const { composerChannelId } = querystring.parse(search);

  if (!community || !community.communityPermissions.isMember) return null;

  const { edges } = community.channelConnection;
  if (!edges || edges.length === 0)
    return <ErrorSelect>This community doesn’t have any channels</ErrorSelect>;

  const nodes = edges.map(edge => edge && edge.node);

  /*
    Selection should be disabled if the channelId was passed as a url query
    param and *also* is that query param is actually a channel within the
    selected community. If it's not, then we should clear out the community
    selection as well
  */
  const channelIsValid = nodes.some(channel => {
    return (
      channel &&
      channel.community.id === selectedCommunityId &&
      channel.id === selectedChannelId &&
      channel.channelPermissions.isMember
    );
  });

  const shouldDisableChannelSelect =
    channelIsValid && composerChannelId === selectedChannelId;

  const sortedNodes = sortChannels(nodes);

  const shouldSelectSingleChannelChild = () => {
    /*
      If there is no channelId in the url and there is only one channel in the
      community (eg general) then just select that first community by default
    */
    if (!selectedChannelId && sortedNodes.length === 1) return true;
    return false;
  };

  const selectSingleChannelChild = () => {
    {
      const firstChannel = sortedNodes[0];
      if (!firstChannel) return null;
      const fakeEvent = { target: { value: firstChannel.id } };
      onChange(fakeEvent);
      return null;
    }
  };

  if (shouldDisableChannelSelect) {
    const channel = nodes.find(
      channel => channel && channel.id === composerChannelId
    );
    if (!channel) {
      if (shouldSelectSingleChannelChild()) return selectSingleChannelChild();
      return (
        <RequiredSelector
          className={className}
          data-cy="composer-channel-selector"
          onChange={onChange}
          value={channelIsValid ? selectedChannelId : ''}
          emphasize={!selectedChannelId}
          {...rest}
        >
          {/* $FlowIssue */}
          <React.Fragment>
            <option value={''}>Choose a channel</option>

            {sortedNodes.map(channel => {
              if (!channel) return null;
              return (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              );
            })}
          </React.Fragment>
        </RequiredSelector>
      );
    }

    return (
      <ChannelPreview className={className} data-cy="composer-channel-selected">
        <Icon glyph={'channel'} size={32} />
        {channel.name}
      </ChannelPreview>
    );
  }

  if (shouldSelectSingleChannelChild()) return selectSingleChannelChild();
  return (
    <RequiredSelector
      className={className}
      data-cy="composer-channel-selector"
      onChange={onChange}
      value={channelIsValid ? selectedChannelId : ''}
      emphasize={!selectedChannelId}
      {...rest}
    >
      {/* $FlowIssue */}
      <React.Fragment>
        <option value={''}>Choose a channel</option>

        {sortedNodes.map(channel => {
          if (!channel) return null;
          return (
            <option key={channel.id} value={channel.id}>
              # {channel.name}
            </option>
          );
        })}
      </React.Fragment>
    </RequiredSelector>
  );
};

export default compose(
  withRouter,
  getCommunityChannelConnection
)(ChannelSelector);
