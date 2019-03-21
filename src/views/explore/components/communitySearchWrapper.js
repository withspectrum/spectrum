// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import theme from 'shared/theme';
import { Primary } from 'src/components/themedSection';
import { Constellations } from 'src/components/illustrations';
import { Button } from 'src/components/button';
import { Tagline, Copy } from 'src/views/pages/style';
import { track, events } from 'src/helpers/analytics';
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

  const SecondaryContent = styled(ThisContent)`
    margin-top: 32px;
    margin-bottom: 0;
    padding: 0;

    button {
      flex: 1;
    }
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 0;
    font-weight: 800;
  `;

  const SecondaryTagline = styled(ThisTagline)`
    font-size: 20px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 2px;
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

  const SecondaryCopy = styled(ThisCopy)`
    margin-bottom: 16px;
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
          Try searching for topics like “crypto” or for products like “React”
        </ThisCopy>
        {props.children}
        <SecondaryContent>
          <SecondaryTagline>Create your own community</SecondaryTagline>
          <SecondaryCopy>
            Building communities on Spectrum is easy and free!
          </SecondaryCopy>

          <Button
            to={'/new/community'}
            onClick={() => track(events.EXPLORE_PAGE_CREATE_COMMUNITY_CLICKED)}
          >
            Create a community
          </Button>
        </SecondaryContent>
      </ThisContent>
      <Constellations />
    </Primary>
  );
};

export default CommunitySearchWrapper;
