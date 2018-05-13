// @flow
import * as React from 'react';
import {
  Footer,
  FooterGrid,
  Masthead,
  Support,
  Safety,
  SocialLinks,
} from '../style';
import Link from 'src/components/link';
import { IconButton } from 'src/components/buttons';
import { Logo } from 'src/components/logo';

export default () => {
  return (
    <Footer>
      <FooterGrid>
        <Masthead>
          <Link to="/">
            <Logo />
          </Link>
          <SocialLinks>
            <a
              href="https://github.com/withspectrum"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton glyph="github" hoverColor={'text.reverse'} />
            </a>
            <a
              href="https://twitter.com/withspectrum"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton glyph="twitter" hoverColor={'text.reverse'} />
            </a>
          </SocialLinks>
        </Masthead>
        <Support>
          <span>Support</span>
          <Link to={`/spectrum`}>Community</Link>
          <Link to={`/spectrum/hugs-n-bugs`}>Bug reports</Link>
          <Link to={`/spectrum/feature-requests`}>Feature requests</Link>
          <a href="mailto:hi@spectrum.chat">Email support</a>
        </Support>
        <Safety>
          <span>Safety</span>
          <a
            href="https://github.com/withspectrum/code-of-conduct"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code of Conduct
          </a>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </Safety>
      </FooterGrid>
    </Footer>
  );
};
