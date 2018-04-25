// @flow
import * as React from 'react';
import type { GetSlackSettingsType } from 'shared/graphql/queries/community/getCommunitySlackSettings';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { Button } from 'src/components/buttons';

type Props = {
  community: GetSlackSettingsType,
  isOnboarding: boolean,
};

class ImportSlackTeam extends React.Component<Props> {
  render() {
    const { community, isOnboarding = false } = this.props;

    const url = isOnboarding
      ? `https://slack.com/oauth/authorize?client_id=201769987287.271382863153&scope=users:read.email%20users:read%20chat:write:bot&state=${
          community.id
        }&redirect_uri=${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3001/api/slack/onboarding'
            : 'https://spectrum.chat/api/slack/onboarding'
        }`
      : `https://slack.com/oauth/authorize?client_id=201769987287.271382863153&scope=users:read.email%20users:read%20chat:write:bot&state=${
          community.id
        }&redirect_uri=${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3001/api/slack'
            : 'https://spectrum.chat/api/slack'
        }`;

    return (
      <SectionCard>
        <SectionTitle>Connect a Slack team</SectionTitle>
        <SectionSubtitle>
          Connect a Slack team to your community to invite your community or
          post new threads into a Slack channel.
        </SectionSubtitle>

        <SectionCardFooter>
          <a href={url}>
            <Button>Connect a Slack team</Button>
          </a>
        </SectionCardFooter>
      </SectionCard>
    );
  }
}

export default ImportSlackTeam;
