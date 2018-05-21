// @flow
import * as React from 'react';
import EditForm from './editForm';
import ChannelList from './channelList';
import BrandedLogin from './brandedLogin';
import { SectionsContainer, Column } from 'src/components/settingsViews/style';
import SlackSettings from './slack';
import { SentryErrorBoundary, SettingsFallback } from 'src/components/error';

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
          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <EditForm community={community} />
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <ChannelList id={community.id} communitySlug={communitySlug} />
          </SentryErrorBoundary>
        </Column>
        <Column>
          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <SlackSettings id={community.id} />
          </SentryErrorBoundary>

          <SentryErrorBoundary fallbackComponent={SettingsFallback}>
            <BrandedLogin id={community.id} />
          </SentryErrorBoundary>
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
