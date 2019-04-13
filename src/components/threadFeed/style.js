// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { hexa } from 'src/components/globals';
import { OutlineButton } from 'src/components/button';
import { MEDIA_BREAK } from 'src/components/layout';

export const Container = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  align-self: stretch;
  align-items: stretch;
  position: relative;

  > div {
    display: flex;
    flex: none;
    flex-direction: column;
    align-self: stretch;
    align-items: stretch;
  }
`;

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
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  text-align: center;
  flex-direction: column;
  padding: 24px;
  background: ${theme.bg.default};
  flex: 1;

  button {
    flex: 1;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    border-bottom: 1px solid ${theme.bg.border};
  }
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

export const LoadingPill = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%)
    translateY(${props => (props.isVisible ? '12px' : '0px')});
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
  padding: 2px 44px;
  min-height: 24px;
  border-radius: 48px;
  background: ${theme.brand.alt};
  border: 1px solid ${theme.brand.default};
  opacity: ${props => (props.isVisible ? '1' : '0')};
  pointer-events: none;
  z-index: 11;
  box-shadow: 0 2px 4px rgba(${hexa(theme.brand.alt, 0.12)});
`;
