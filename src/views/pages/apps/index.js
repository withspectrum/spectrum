// @flow
import * as React from 'react';
import Section from 'src/components/themedSection';
import PageFooter from '../components/footer';
import Link from 'src/components/link';
import { Wrapper } from '../style';
import { Heading, Copy } from '../pricing/style';
import { Button } from 'src/components/buttons';
import { Intro, ActionsContainer, TextContent, Devices } from './style';
import type { ContextRouter } from 'react-router';
import { track, events } from 'src/helpers/analytics';
import Head from 'src/components/head';

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
        <Section goop={6} color="text.default">
          <Intro>
            <Devices src="https://spectrum.imgix.net/marketing/electron.png?h=0.25&dpr=2&auto=compress,format" />
            <TextContent>
              <Heading>Spectrum for Mac & Windows</Heading>

              <Copy style={{ marginTop: '8px', marginBottom: '40px' }}>
                Keep up with your communities without distractions.
              </Copy>

              <ActionsContainer>
                <Link to={`/new/community`}>
                  <Button
                    large
                    icon="apple"
                    onClick={() => track(events.APPS_PAGE_DOWNLOAD_MAC_CLICKED)}
                  >
                    Download for Mac
                  </Button>
                </Link>
                <Link to={`/new/community`}>
                  <Button
                    large
                    icon="windows"
                    onClick={() =>
                      track(events.APPS_PAGE_DOWNLOAD_WINDOWS_CLICKED)
                    }
                  >
                    Download for Windows
                  </Button>
                </Link>
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
