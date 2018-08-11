// @flow
import React from 'react';
import styled from 'styled-components';
import Link from 'src/components/link';
import Icon from 'src/components/icon';
import { Transition, zIndex, Shadow, hexa } from 'src/components/globals';
import ViewSegment from 'src/components/themedSection';
import { Button } from 'src/components/button';
import { CLIENT_URL } from 'src/api/constants';
import { Tagline, Copy, Content } from '../../pages/style';
import { track, events } from 'src/helpers/analytics';

// $FlowFixMe
const CommunitySearchWrapper = props => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    width: 640px;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 0;
    padding: 16px;
    padding-bottom: 48px;

    @media (max-width: 640px) {
      margin-top: 80px;
      margin-bottom: 0;
      width: 100%;
    }
  `;

  const SecondaryContent = styled(ThisContent)`
    margin-top: 0;
    margin-bottom: 0;
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 0;
  `;

  const SecondaryTagline = styled(ThisTagline)`
    font-size: 20px;
    font-weight: 900;
    margin-top: 0;
    margin-bottom: 2px;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 16px;
    margin-bottom: 16px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: 768px) {
      text-align: left;
    }
  `;

  const SecondaryCopy = styled(ThisCopy)`
    margin-bottom: 16px;
  `;

  return (
    <ViewSegment goop={3} background="constellations">
      <ThisContent>
        <ThisTagline>Find a community for you!</ThisTagline>
        <ThisCopy>
          Try searching for topics like "crypto" or for products like "React"
        </ThisCopy>
        {props.children}
        <SecondaryContent>
          <SecondaryTagline>...or create your own community</SecondaryTagline>
          <SecondaryCopy>
            Building communities on Spectrum is easy and free!
          </SecondaryCopy>
          {props.currentUser ? (
            <Button
              to={'/new/community'}
              onClick={() =>
                track(events.EXPLORE_PAGE_CREATE_COMMUNITY_CLICKED)
              }
            >
              <Icon glyph={'community'} />
              Create a community
            </Button>
          ) : (
            <Button to={`/login?r=${CLIENT_URL}/new/community`}>
              <Icon glyph={'community'} />
              Create a community
            </Button>
          )}
        </SecondaryContent>
      </ThisContent>
    </ViewSegment>
  );
};

export default CommunitySearchWrapper;
