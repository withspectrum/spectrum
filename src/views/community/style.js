import styled from 'styled-components';
import { IconButton } from '../../components/buttons';
import { FlexRow, FlexCol, Shadow, hexa } from '../../components/globals';

export const CoverRow = styled(FlexRow)`
  align-items: flex-start;

  > div {
    margin-top: 24px;
  }

  > .inset {
    margin-top: -64px;
  }

  @media (max-width: 768px) {

  }
`;

export const CoverColumn = styled(FlexCol)`
  width: 90%;
  max-width: 1024px;

  @media (max-width: 768px) {
      width: 100%;
  }
`;

export const CoverButton = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    bottom: 16px;
    top: auto;
  }
`;

export const MobileCommunityProfile = styled(FlexRow)`
  display: none;

  @media (max-width: 768px) {
      display: inline-block;
      width: 100%;
      justify-content: center;

      > div {
        width: 100%;
      }
  }
`;
