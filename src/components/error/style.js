// @flow
import styled from 'styled-components';

export const FullScreen = styled.div`
  width: 100%;
  height 100%;
  padding: 1em;
  background: ${p => p.theme.bg.default};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Title = styled.h1`
  color ${p => p.theme.warn.default};
`;

export const Text = styled.p`
  margin-bottom: 1em;
`;
