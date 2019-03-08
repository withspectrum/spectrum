// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { MEDIA_BREAK, SECONDARY_COLUMN_WIDTH } from 'src/components/layout';

export const SidebarSection = styled.section`
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};
  margin-top: 16px;
  border-radius: 4px;

  @media (max-width: ${MEDIA_BREAK}px) {
    border: 0;
    margin-top: 0;

    &:last-of-type {
      border-bottom: 1px solid ${theme.bg.border};
    }

    &:not(:first-of-type) {
      border-top: 1px solid ${theme.bg.border};
    }
  }
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-radius: 0;
    margin-top: 0;
    border: 0;
  }
`;

export const CoverPhoto = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: ${SECONDARY_COLUMN_WIDTH / 3}px;
  max-height: ${SECONDARY_COLUMN_WIDTH / 3}px;
  background-color: ${theme.text.default};
  overflow: hidden;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center center;
  border-radius: 4px 4px 0 0;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-radius: 0;
  }
`;

export const ProfileAvatarContainer = styled.div`
  position: relative;
  top: -36px;
  width: 68px;
  height: 68px;
  margin-left: 12px;
  border-radius: 10px;
  background: ${theme.bg.default};
  border: 4px solid ${theme.bg.default};
  margin-bottom: -56px;
`;

export const RoundProfileAvatarContainer = styled.div`
  position: relative;
  top: -36px;
  width: 68px;
  height: 68px;
  margin-left: 12px;
  border-radius: 34px;
  background: ${theme.bg.default};
  border: 4px solid ${theme.bg.default};
  margin-bottom: -56px;
`;

export const ActionsRowContainer = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 12px;
  padding: 16px 16px 20px;
  margin-top: 8px;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-bottom: 1px solid ${theme.bg.border};
    margin-top: 0;
    padding-bottom: 16px;
  }
`;

export const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  margin-top: 24px;
`;

export const Name = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: ${theme.text.default};
`;

export const Description = styled.p`
  margin-top: 8px;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  color: ${theme.text.secondary};
`;

export const MetaLinksContainer = styled.div`
  margin-top: 4px;
`;

export const MetaRow = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 400;
  color: ${theme.text.secondary};
  align-items: center;
  margin-top: 8px;

  &:first-of-type {
    margin-top: 8px;
  }

  a {
    display: flex;
    align-items: center;
  }

  a:hover {
    color: ${theme.text.default};
  }

  .icon {
    margin-right: 8px;
  }
`;

export const OnlineDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${theme.success.default};
  margin-right: 16px;
  margin-left: 6px;
`;

export const ChannelCommunityMetaRow = styled.div`
  display: flex;
  padding: 16px;
  margin-bottom: -12px;
  align-items: center;
  border-bottom: 1px solid ${theme.bg.border};
  background: transparent;

  &:hover {
    background: ${theme.bg.wash};
  }
`;

export const ChannelCommunityName = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${theme.text.alt};
  margin-left: 16px;
`;

export const Username = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${theme.text.alt};
  margin-bottom: 4px;
`;
