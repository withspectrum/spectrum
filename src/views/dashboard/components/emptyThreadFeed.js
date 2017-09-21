// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { Button } from '../../../components/buttons';
import { NullThreadFeed, NullHeading } from '../style';

export default props => (
  <NullThreadFeed>
    <NullHeading>
      There are no conversations in this community yet...
    </NullHeading>
    <Button>
      <Link
        to={{
          pathname: window.location.pathname,
          search: `?t=new`,
        }}
      >
        Start a conversation
      </Link>
    </Button>
  </NullThreadFeed>
);
