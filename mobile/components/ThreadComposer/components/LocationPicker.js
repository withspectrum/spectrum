// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Row } from '../../../components/Flex';
import Select from '../../../components/Select';
import Loading from '../../../components/Loading';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';
import getComposerCommunitiesAndChannels, {
  type GetComposerType,
} from '../../../../shared/graphql/queries/composer/getComposerCommunitiesAndChannels';
import type { PickerItem } from 'react-native-picker-select';

type LocationPickerProps = {
  selected: {
    community: ?string,
    channel: ?string,
  },
  onSelectedChange: ({ channel: ?string, community: ?string }) => void,
  data: {
    user?: $Exact<GetComposerType>,
  },
  ...$Exact<ViewNetworkHandlerProps>,
};

const LocationPicker = (props: LocationPickerProps) => {
  const {
    selected,
    onSelectedChange,
    hasError,
    isLoading,
    data: { user },
  } = props;

  if (hasError) return null;

  if (isLoading) return <Loading />;

  if (!user || !user.communityConnection || !user.channelConnection)
    return null;

  const communities = user.communityConnection.edges
    .filter(Boolean)
    .map(({ node }) => ({
      label: node.name,
      value: node.id,
    }));
  const channels = user.channelConnection.edges
    .filter(Boolean)
    .map(({ node }) => ({
      label: node.name,
      value: node.id,
    }));
  return (
    <Row style={{ justifyContent: 'flex-start' }}>
      <Select
        placeholder={{ label: 'Select a community', value: null }}
        items={communities}
        value={selected.community}
        onValueChange={value =>
          onSelectedChange({ channel: selected.channel, community: value })
        }
        style={{ marginRight: 8, marginVertical: 8 }}
      />
      <Select
        placeholder={{ label: 'Select a channel', value: null }}
        placeholder={{ label: 'Select a channel', value: null }}
        items={channels}
        value={selected.channel}
        onValueChange={value =>
          onSelectedChange({ community: selected.community, channel: value })
        }
        style={{ marginVertical: 8 }}
      />
    </Row>
  );
};

export default compose(ViewNetworkHandler, getComposerCommunitiesAndChannels)(
  LocationPicker
);
