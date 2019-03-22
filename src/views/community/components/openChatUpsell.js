// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { FeedsContainer } from '../style';
import { NullCard } from 'src/components/upsell';
import {
  Title,
  Subtitle,
  Actions,
  LargeEmoji,
} from 'src/components/upsell/style';
import { PrimaryButton } from 'src/components/button';
import enableCommunityWatercooler from 'shared/graphql/mutations/community/enableCommunityWatercooler';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';

type Props = {
  community: CommunityInfoType,
  enableCommunityWatercooler: Function,
};

const OpenChatUpsell = (props: Props) => {
  const enable = evt => {
    evt.preventDefault();
    props.enableCommunityWatercooler({
      id: props.community.id,
    });
  };
  return (
    <FeedsContainer
      style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}
    >
      <NullCard>
        <LargeEmoji css={{ padding: 0 }}>
          <span role="img" aria-label="Howdy!">
            💬
          </span>
        </LargeEmoji>
        <Title>Enable Open Chat</Title>
        <Subtitle>
          Show a chat room here where your community can hang out together.
        </Subtitle>
        <Actions>
          <Link to={`/${props.community.slug}/settings`} onClick={enable}>
            <PrimaryButton>Enable Open Chat</PrimaryButton>
          </Link>
        </Actions>
      </NullCard>
    </FeedsContainer>
  );
};

export default enableCommunityWatercooler(OpenChatUpsell);
