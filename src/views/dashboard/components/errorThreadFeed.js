import React from 'react';
import Link from 'src/components/link';
import { Button } from 'src/components/button';
import { NullThreadFeed, NullHeading } from '../style';

export default props => (
  <NullThreadFeed>
    <NullHeading>
      There was a problem loading this feed. Please try refreshing the page.
    </NullHeading>

    <Button>
      <Link to={'/'}>Refresh</Link>
    </Button>
  </NullThreadFeed>
);
