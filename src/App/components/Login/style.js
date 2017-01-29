import styled from 'styled-components';

export const LoginHeader = styled.form`
  display: flex;
  flex-direction: column;
  margin: 8px;
  padding: 8px;
  align-items: center;
  border-radius: 8px;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 8px #000000;
    transition: box-shadow 0.2s ease-in-out;
  }
`;

export const Input = styled.input`
  background-color: #2E313F;
  border-radius: 4px;
  height: 24px;
  width: 100%;
  margin-top: 8px;
  padding-left: 8px;
  font-weight: 500;
  font-size: 12px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 24px;
  vertical-align: middle;
  color: #ffffff;

  &:first-of-type { margin-top: 16px }
  &::placeholder { color: #747E8D }
  &::-webkit-input-placeholder { color: #747E8D }
  &:-moz-placeholder { color: #747E8D }
  &:-ms-input-placeholder { color: #747E8D }
`;

export const Logo = styled.img`
  width: 137px;
  height: 24px;
  align-self: flex-start;
`;