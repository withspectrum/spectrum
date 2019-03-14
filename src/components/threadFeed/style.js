// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { OutlineButton } from 'src/components/buttons';
import { MEDIA_BREAK } from 'src/components/layout';

export const FetchMoreButton = styled(OutlineButton)`
  width: 100%;
  padding: 16px 0;

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 32px 0;
    border-radius: 0;
    background: #fff;
    font-size: 16px;
    font-weight: 600;
    color: ${theme.brand.default};
    border: none;
    box-shadow: none;
    border-top: 2px solid ${theme.bg.border};

    &:hover {
      background: ${theme.bg.wash};
      border-radius: 0;
      box-shadow: none;
    }
  }
`;

export const Divider = styled.div`
  border-bottom: 2px solid ${theme.bg.border};
  width: 100%;
  display: block;
  padding-top: 24px;
  margin-bottom: 24px;
`;

export const NullColumn = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  padding: 24px;
  background: ${theme.bg.default};
  border-bottom: 1px solid ${theme.bg.border};
  min-height: calc(100vh - 56px);
`;

export const NullColumnHeading = styled.h3`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 8px;
  color: ${theme.text.default};
  max-width: 540px;
`;
export const NullColumnSubheading = styled.p`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  color: ${theme.text.secondary};
  margin-bottom: 24px;
  max-width: 360px;
`;
