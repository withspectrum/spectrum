// $FlowFixMe
import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

export const Action = styled.div`
  margin-top: 14px;
  margin-left: 8px;
`;

export const Form = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin-top: 32px;
`;

export const InputLabel = styled.h3`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
  margin-bottom: 8px;
`;

export const InputSubLabel = styled.h4`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  margin-bottom: 16px;
  line-height: 1.4;
`;
