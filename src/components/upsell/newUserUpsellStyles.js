// @flow
// $FlowFixMe
import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  margin: 64px 32px 32px;
  height: 2px;
`;

export const SectionHeaderNumber = styled.span`
  position: absolute;
  left: 50%;
  top: -16px;
  width: 32px;
  height: 32px;
  font-size: 16px;
  color: ${props => props.theme.brand.default};
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 2px solid ${props => props.theme.brand.default};
  font-weight: 700;
  transform: translateX(-50%);
`;
