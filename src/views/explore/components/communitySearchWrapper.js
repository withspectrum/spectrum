// @flow
import React from 'react';
import styled from 'styled-components';
import theme from 'shared/theme';
import { Primary } from 'src/components/themedSection';
import { Constellations } from 'src/components/illustrations';
import { Tagline, Copy } from 'src/views/pages/style';
import { MEDIA_BREAK } from 'src/components/layout';

// $FlowFixMe
const CommunitySearchWrapper = props => {
  const ThisContent = styled.div`
    flex-direction: column;
    display: flex;
    max-width: 640px;
    justify-self: center;
    justify-content: center;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 0;
    padding: 16px;
    padding-bottom: 72px;
    text-align: center;

    @media (max-width: ${MEDIA_BREAK}px) {
      margin-bottom: 0;
      width: 100%;
      text-align: left;
      justify-self: flex-start;
      justify-content: flex-start;
    }
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 0;
    font-weight: 800;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 16px;
    margin-bottom: 16px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: ${MEDIA_BREAK}px) {
      text-align: left;
    }
  `;

  return (
    <Primary
      style={{
        display: 'flex',
        justifyContent: 'center',
        borderBottom: `1px solid ${theme.bg.border}`,
      }}
    >
      <ThisContent>
        <ThisTagline>Find a community</ThisTagline>
        <ThisCopy>
          {/* Try searching for topics like “crypto” or for products like “React” */}
        </ThisCopy>
        {props.children}
      </ThisContent>
      <Constellations />
    </Primary>
  );
};

export default CommunitySearchWrapper;
