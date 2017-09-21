import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: text;

  .DraftEditor-root {
    margin-top: 0;
  }
`;

export const MediaRow = styled.div`
  display: flex;
  background: #f8fbfe;
  border-top: 2px solid ${props => props.theme.bg.border};
  padding: 0 16px;
  margin-left: -24px;
  margin-bottom: -28px;
  margin-top: 16px;
  width: calc(100% + 48px);

  @media (max-width: 768px) {
    position: absolute;
    top: calc(100% - 90px);
  }
`;
