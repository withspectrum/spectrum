// @flow
import * as React from 'react';
import { LinkBlock, LinkBlockA, Footer, Flexer } from '../style';
import { FlexRow } from 'src/components/globals';
import Link from 'src/components/link';
import Icon from 'src/components/icons';
import * as events from 'shared/analytics/event-types';
import { track } from 'src/helpers/events';

export default () => {
  return (
    <Footer>
      <FlexRow>
        <Link to="/">
          <Icon glyph="logo" size={32} />
        </Link>
      </FlexRow>
      <Flexer>
        <LinkBlock to="/privacy">
          <div>Privacy</div>
        </LinkBlock>
        <LinkBlock to="/terms">
          <div>Terms</div>
        </LinkBlock>
        <LinkBlockA
          href="https://github.com/withspectrum/code-of-conduct"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track(events.CODE_OF_CONDUCT_CLICKED, {
              location: 'splash page footer',
            })
          }
        >
          <div>Code of Conduct</div>
        </LinkBlockA>
      </Flexer>
    </Footer>
  );
};
