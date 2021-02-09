// @flow
import * as React from 'react';
import { Footer, FooterGrid, Masthead, Safety } from '../style';

export default () => {
  return (
    <Footer>
      <FooterGrid>
        <Masthead>
          <Safety>
            <span>Safety</span>
            <a
              href="https://github.com/withspectrum/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code of Conduct
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                'https://help.github.com/en/github/site-policy/github-privacy-statement'
              }
            >
              Privacy Statement
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                'https://help.github.com/en/github/site-policy/github-terms-of-service'
              }
            >
              Terms of Service
            </a>
          </Safety>
        </Masthead>
      </FooterGrid>
    </Footer>
  );
};
