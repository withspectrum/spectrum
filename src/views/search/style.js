import styled from 'styled-components';
export const Input = styled.input`
  display: flex;
  flex: auto;
  font-size: 18px;
  border: 1px solid ${props => props.theme.bg.border};
  border-radius: 80px;
  padding: 20px;
`;

export const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex: none;
`;
