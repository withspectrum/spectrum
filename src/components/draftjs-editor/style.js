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
  background: ${props => props.theme.bg.wash};
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

export const ComposerBase = styled.div`
  position: relative;
  flex: none;
  flex-direction: column;
  display: flex;

  > label {
    position: absolute;
    right: calc(100% + 8px);
    top: auto;
    bottom: -11px;
    padding: 0;
    margin: 0;
    color: ${props => props.theme.text.placeholder};
  }
`;
