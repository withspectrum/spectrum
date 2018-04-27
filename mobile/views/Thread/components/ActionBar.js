// @flow
import React from 'react';
import styled from 'styled-components/native';
import Anchor, { type ShareContent } from '../../../components/Anchor';

const ActionBarContainer = styled.View`
  flex: 1;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin: 16px 0;
  background: ${props => props.theme.bg.wash};
  padding: 8px;
  border-bottom-color: ${props => props.theme.bg.border};
  border-top-color: ${props => props.theme.bg.border};
  border-top-width: 1px;
  border-bottom-width: 1px;
`;

type Props = {
  content: ShareContent,
};

export default (props: Props) => {
  return (
    <ActionBarContainer>
      <Anchor content={props.content}>Share</Anchor>
    </ActionBarContainer>
  );
};
