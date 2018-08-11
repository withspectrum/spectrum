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
import Icon from 'src/components/icon';
import Link from 'src/components/link';
import { IconButton } from 'src/components/button';
import { Logo } from 'src/components/logo';
import { track, events } from 'src/helpers/analytics';

export default () => {
  return (
    <Footer>
      <FooterGrid>
        <Masthead>
          <Link to="/">
            <Logo />
          </Link>
          <SocialLinks>
            <IconButton
              href="https://github.com/withspectrum"
              hoverColor={theme => theme.text.reverse}
            >
              <Icon glyph="github" size={32} />
            </IconButton>

            <IconButton
              href="https://twitter.com/withspectrum"
              hoverColor={theme => theme.text.reverse}
            >
              <Icon glyph="twitter" size={32} />
            </IconButton>
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
            onClick={() =>
              track(events.CODE_OF_CONDUCT_CLICKED, {
                location: 'splash page footer',
              })
            }
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
