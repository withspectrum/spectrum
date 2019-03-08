// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import Icon from 'src/components/icons';
import {
  MetaContainer,
  Name,
  Description,
  MetaLinksContainer,
  MetaRow,
  OnlineDot,
} from '../style';

export const ChannelMeta = (props: ChannelMetaType) => {
  const { channel } = props;
  const { description, metaData, community } = channel;
  const { members, onlineMembers } = metaData;
  const formattedDescription = description && renderTextWithLinks(description);

  return (
    <MetaContainer>
      <Link to={`/${community.slug}/${channel.slug}`}>
        <Name># {channel.name}</Name>
      </Link>

      {formattedDescription && (
        <Description>{formattedDescription}</Description>
      )}

      <MetaLinksContainer>
        <MetaRow>
          <Icon glyph={'person'} size={20} /> {members.toLocaleString()} members
        </MetaRow>

        <MetaRow>
          <OnlineDot /> {onlineMembers.toLocaleString()} members online
        </MetaRow>
      </MetaLinksContainer>
    </MetaContainer>
  );
};
