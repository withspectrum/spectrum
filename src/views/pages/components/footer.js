// @flow
import * as React from 'react';
import { LinkBlock, LinkBlockA, Footer, Flexer } from '../style';
import { FlexRow } from 'src/components/globals';
import Link from 'src/components/link';
import Icon from 'src/components/icons';

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
        >
          <div>Code of Conduct</div>
        </LinkBlockA>
      </Flexer>
    </Footer>
  );
};
