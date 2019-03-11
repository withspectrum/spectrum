// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import { MetaContainer, Name, Description } from '../style';

export const ChannelMeta = (props: ChannelMetaType) => {
  const { channel } = props;
  const { description, community } = channel;
  const formattedDescription = description && renderTextWithLinks(description);

  return (
    <MetaContainer>
      <Link to={`/${community.slug}/${channel.slug}`}>
        <Name># {channel.name}</Name>
      </Link>

      {formattedDescription && (
        <Description>{formattedDescription}</Description>
      )}
    </MetaContainer>
  );
};
