// @flow
import * as React from 'react';
import EditForm from './editForm';
import ChannelList from './channelList';
import BrandedLogin from './brandedLogin';
import { SectionsContainer, Column } from 'src/components/settingsViews/style';
import SlackSettings from './slack';

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
          <EditForm community={community} />
          <ChannelList id={community.id} communitySlug={communitySlug} />
        </Column>
        <Column>
          <SlackSettings id={community.id} />
          <BrandedLogin id={community.id} />
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
