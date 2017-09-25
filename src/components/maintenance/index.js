// @flow
import React from 'react';
import styled from 'styled-components';
import AppViewWrapper from '../appViewWrapper';
import { Column } from '../column';
import Card from '../card';
import { H1 } from '../globals';

const Emoji = styled.div`
  font-size: 3em;
  text-align: center;
  line-height: 1.5em;
  margin-bottom: 0.25em;
`;

const Wrapper = styled.div`
  margin: 2em;

  a {
    color: ${props => props.theme.brand.default};
  }
`;

const Title = H1.extend`margin-bottom: 0.5em;`;

const MaintenanceDowntime = props => {
  return (
    <AppViewWrapper>
      <Column type="primary" alignItems="center">
        <Card>
          <Wrapper>
            <Emoji>🛠</Emoji>
            <Title>
              Spectrum is currently undergoing scheduled maintenance
            </Title>
            <p>
              We'll be back at 3pm UTC, check{' '}
              <a href="https://twitter.com/withspectrum">
                twitter.com/withspectrum
              </a>{' '}
              for ongoing updates.
            </p>
          </Wrapper>
        </Card>
      </Column>
    </AppViewWrapper>
  );
};

export default MaintenanceDowntime;
