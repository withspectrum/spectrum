// @flow
import React from 'react';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import addProtocolToString from 'shared/normalize-url';
import type { CommunityMetaType } from '../types';
import Icon from 'src/components/icons';
import {
  MetaContainer,
  CommunityName,
  CommunityDescription,
  CommunityMetaRow,
  MetaLinksContainer,
  OnlineDot,
} from '../style';

export const CommunityMeta = (props: CommunityMetaType) => {
  const { community } = props;
  const { description, website, metaData } = community;
  const { members, onlineMembers } = metaData;
  const formattedDescription = description && renderTextWithLinks(description);
  const formattedWebsite = website && addProtocolToString(website);

  return (
    <MetaContainer>
      <CommunityName>{community.name}</CommunityName>

      {formattedDescription && (
        <CommunityDescription>{formattedDescription}</CommunityDescription>
      )}

      <MetaLinksContainer>
        {formattedWebsite && (
          <CommunityMetaRow>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={formattedWebsite}
            >
              <Icon glyph={'link'} size={20} /> {website}
            </a>
          </CommunityMetaRow>
        )}

        <CommunityMetaRow>
          <Icon glyph={'person'} size={20} /> {members.toLocaleString()} members
        </CommunityMetaRow>

        <CommunityMetaRow>
          <OnlineDot /> {onlineMembers.toLocaleString()} members online
        </CommunityMetaRow>
      </MetaLinksContainer>
    </MetaContainer>
  );
};
