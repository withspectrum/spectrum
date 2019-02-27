// @flow
import React, { useState, useEffect } from 'react';
import { useAsync } from 'react-async-hook';
import compose from 'recompose/compose';
import type { Location } from 'react-router';
import { withRouter } from 'react-router-dom';
import querystring from 'query-string';
import { Dropdowns, RequiredSelector, DropdownsLabel } from '../style';
import { getCommunityByIdQuery } from 'shared/graphql/queries/community/getCommunity';
import CommunitySelector from './CommunitySelector';
import ChannelSelector from './ChannelSelector';

type Props = {
  onCommunitySelectionChanged: Function,
  onChannelSelectionChanged: Function,
  selectedCommunityId: ?string,
  selectedChannelId: ?string,
  location: Location,
};

const ComposerLocationSelectors = (props: Props) => {
  const {
    selectedCommunityId,
    selectedChannelId,
    onCommunitySelectionChanged,
    onChannelSelectionChanged,
  } = props;

  const setStateFromQueryParams = () => {
    const { location } = props;
    const { search } = location;
    const { composerCommunityId, composerChannelId } = querystring.parse(
      search
    );

    // tell the parent composer that we have query params
    onCommunitySelectionChanged(composerCommunityId);
    onChannelSelectionChanged(composerChannelId);
  };

  // Run once on mount
  useEffect(() => {
    setStateFromQueryParams();
  }, []);

  /*
    Whenever the browser location.search changes, check for query parameters 
    related to the composer and update the state of the composer.
  */
  useEffect(
    () => {
      setStateFromQueryParams();
    },
    [location.search]
  );

  return (
    <Dropdowns>
      <DropdownsLabel>Post to: </DropdownsLabel>

      <CommunitySelector
        id={selectedCommunityId}
        onCommunityChange={onCommunitySelectionChanged}
      />

      <ChannelSelector
        id={selectedCommunityId}
        selectedChannelId={selectedChannelId}
        selectedCommunityId={selectedCommunityId}
        onInvalidChannelId={onCommunitySelectionChanged}
        onChannelChange={onChannelSelectionChanged}
      />
    </Dropdowns>
  );
};

export default compose(withRouter)(ComposerLocationSelectors);
