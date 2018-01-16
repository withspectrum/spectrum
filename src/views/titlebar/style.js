// @flow
// $FlowFixMe
import styled from 'styled-components';
import { hexa, Shadow, FlexRow, zIndex } from '../../components/globals';

export const TitleBar = styled(FlexRow)`
  grid-area: title;
  width: 100%;
  display: grid;
  grid-template-columns: 32px minmax(1fr, calc(100% - 96px)) 32px;
  grid-template-rows: 1fr;
  grid-template-areas: 'left center right';
  grid-column-gap: 16px;
  padding: 0 8px;
  background-color: ${({ theme }) => theme.bg.reverse};
  color: ${({ theme }) => theme.text.reverse};
  min-height: 48px;
  height: 48px;
  max-height: 48px;
  order: 0;
  flex: 0 0 48px;
  z-index: ${zIndex.chrome};
  box-shadow: ${Shadow.mid} ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
  justify-items: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const Text = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  align-content: center;
  align-items: center;
  flex: auto;
  justify-self: center;
  align-self: center;
  grid-area: center;
`;

export const Title = styled.h3`
  font-size: ${props => (props.large ? '18px' : '14px')};
  font-weight: 800;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  white-space: nowrap;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => hexa(theme.text.reverse, 0.75)};
  font-size: 12px;
  letter-spacing: 0.2px;
  font-weight: 600;
  line-height: 1.4;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  white-space: nowrap;
`;
