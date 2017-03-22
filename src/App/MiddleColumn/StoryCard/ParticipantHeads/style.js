import styled from 'styled-components';
import { Tooltip } from '../../../../shared/Globals';

export const Container = styled.div`
  margin-top: 12px;
`;

export const HeadWrapper = styled.span`
  ${props => props.tipText ? Tooltip(props) : ''};
`;

export const Head = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px rgba(0,0,0,0.2);
`;

export const Label = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.alt};
  position: relative;
  top: -4px;
  margin-left: -${props => props.length}px;
  font-weight: 500;
`;
