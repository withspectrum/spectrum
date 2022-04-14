// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import addProtocolToString from 'shared/normalize-url';
import Icon from 'src/components/icon';
import {
  MetaContainer,
  Name,
  Description,
  MetaLinksContainer,
  MetaRow,
  OnlineDot,
} from '../style';

type Props = {
  // TODO: Properly type this
  community: Object,
};

export const CommunityMeta = (props: Props) => {
  const { community } = props;
  const { description, website } = community;
  const formattedDescription = description && renderTextWithLinks(description);
  const formattedWebsite = website && addProtocolToString(website);

  return (
    <MetaContainer>
      <Link to={`/${community.slug}`}>
        <Name>{community.name}</Name>
      </Link>

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

        {community.metaData && (
          <React.Fragment>
            <MetaRow as={Link} to={`/${community.slug}?tab=members`}>
              <Icon glyph={'person'} size={20} />{' '}
              {community.metaData.members.toLocaleString()} members
            </MetaRow>

            <MetaRow as={Link} to={`/${community.slug}?tab=members`}>
              <OnlineDot /> {community.metaData.onlineMembers.toLocaleString()}{' '}
              members online
            </MetaRow>
          </React.Fragment>
        )}
      </MetaLinksContainer>
    </MetaContainer>
  );
};
