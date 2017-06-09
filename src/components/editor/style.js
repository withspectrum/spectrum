import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: text;
`;

export const MediaRow = styled.div`
  display: flex;
  background: #F8FBFE;
  border-top: 2px solid ${props => props.theme.border.default};
  padding: 0 16px;
  margin-left: -24px;
  margin-bottom: -28px;
  margin-top: 16px;
  width: calc(100% + 48px);
`;
