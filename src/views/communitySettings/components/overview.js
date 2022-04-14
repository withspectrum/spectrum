// @flow
import * as React from 'react';
import EditForm from './editForm';
import ChannelList from './channelList';
import BrandedLogin from './brandedLogin';
import { SectionsContainer, Column } from 'src/components/settingsViews/style';
import SlackSettings from './slack';
import RedirectSettings from './redirect';
import Watercooler from './watercooler';
import { ErrorBoundary, SettingsFallback } from 'src/components/error';

type Props = {
  communitySlug: string,
  community: Object,
};

class Overview extends React.Component<Props> {
  render() {
    const { community, communitySlug } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <EditForm community={community} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <RedirectSettings community={community} />
          </ErrorBoundary>
        </Column>
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <SlackSettings id={community.id} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <BrandedLogin id={community.id} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <Watercooler id={community.id} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <ChannelList id={community.id} communitySlug={communitySlug} />
          </ErrorBoundary>
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
