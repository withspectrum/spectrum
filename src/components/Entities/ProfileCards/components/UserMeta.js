// @flow
import React from 'react';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import addProtocolToString from 'shared/normalize-url';
import Icon from 'src/components/icons';
import {
  MetaContainer,
  Name,
  Description,
  MetaLinksContainer,
  MetaRow,
  OnlineDot,
} from '../style';

export const UserMeta = (props: UserMetaType) => {
  const { user } = props;
  const { description, website, githubUsername, isOnline } = user;
  const formattedDescription = description && renderTextWithLinks(description);
  const formattedWebsite = website && addProtocolToString(website);

  return (
    <MetaContainer>
      <Name>{user.name}</Name>

      {formattedDescription && (
        <Description>{formattedDescription}</Description>
      )}

      <MetaLinksContainer>
        {formattedWebsite && (
          <MetaRow>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={formattedWebsite}
            >
              <Icon glyph={'link'} size={20} /> {website}
            </a>
          </MetaRow>
        )}

        {githubUsername && (
          <MetaRow>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://github.com/${githubUsername}`}
            >
              <Icon glyph={'github'} size={20} /> @{githubUsername}
            </a>
          </MetaRow>
        )}

        {isOnline && (
          <MetaRow>
            <OnlineDot /> Online now
          </MetaRow>
        )}
      </MetaLinksContainer>
    </MetaContainer>
  );
};
