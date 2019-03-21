// @flow
import * as React from 'react';
import Section from 'src/components/themedSection';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import { Heading, Copy } from '../pricing/style';
import { PrimaryButton } from 'src/components/button';
import Icon from 'src/components/icon';
import { Intro, ActionsContainer, TextContent } from './style';
import type { ContextRouter } from 'react-router';
import { track, events } from 'src/helpers/analytics';
import Head from 'src/components/head';
import { DESKTOP_APP_MAC_URL } from 'src/helpers/desktop-app-utils';

type Props = {
  ...$Exact<ContextRouter>,
};

type State = {
  ownsCommunities: boolean,
};

class Features extends React.Component<Props, State> {
  componentDidMount() {
    track(events.APPS_PAGE_VIEWED);
  }

  render() {
    return (
      <Wrapper data-cy="apps-page">
        <Head
          title={'Spectrum · Apps'}
          description={'Download Spectrum for Mac and Windows'}
        />
        <Section goop={6} color="bg.reverse">
          <Intro>
            <TextContent>
              <Heading>Spectrum for Mac</Heading>

              <Copy style={{ marginTop: '8px', marginBottom: '40px' }}>
                Keep up with your communities without distractions.
              </Copy>

              <ActionsContainer>
                <PrimaryButton
                  href={DESKTOP_APP_MAC_URL}
                  onClick={() => track(events.APPS_PAGE_DOWNLOAD_MAC_CLICKED)}
                >
                  <Icon glyph={'apple'} />
                  Download for Mac
                </PrimaryButton>
              </ActionsContainer>
            </TextContent>
          </Intro>
        </Section>
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Features;
