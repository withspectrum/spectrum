// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import { Button } from '../../../components/buttons';
import { NullThreadFeed, NullHeading } from '../style';

const EmptySearchFeed = ({ dispatch, queryString }) => (
  <NullThreadFeed>
    <NullHeading>We couldn't find any results for "{queryString}"</NullHeading>
    <Button icon={'post'} onClick={() => dispatch(changeActiveThread('new'))}>
      Be the first to post about it
    </Button>
  </NullThreadFeed>
);

export default connect()(EmptySearchFeed);
