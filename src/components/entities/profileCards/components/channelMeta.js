// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import { MetaContainer, Name, Description, Username } from '../style';

export const ChannelMeta = (props: ChannelMetaType) => {
  const { channel } = props;
  const { description, community, isArchived } = channel;
  const formattedDescription = description && renderTextWithLinks(description);

  return (
    <MetaContainer style={{ marginTop: '20px' }}>
      <Link to={`/${community.slug}/${channel.slug}`}>
        <Name># {channel.name}</Name>
      </Link>

      {isArchived && <Username>Archived</Username>}

      {formattedDescription && (
        <Description>{formattedDescription}</Description>
      )}
    </MetaContainer>
  );
};
