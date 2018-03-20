// @flow
import * as React from 'react';
import { LinkBlock, Footer, Flexer } from '../style';
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
        <LinkBlock href="/privacy">
          <div>Privacy</div>
        </LinkBlock>
        <LinkBlock href="/terms">
          <div>Terms</div>
        </LinkBlock>
        <LinkBlock href="https://github.com/withspectrum/code-of-conduct">
          <div>Code of Conduct</div>
        </LinkBlock>
      </Flexer>
    </Footer>
  );
};
