import styled from 'styled-components';

export const LoginHeader = styled.form`
  display: flex;
  flex-direction: column;
  margin: 8px;
  padding: 8px;
  align-items: center;
  border-radius: 8px;
`;

export const Input = styled.input`
  background-color: #2E313F;
  border-radius: 4px;
  width: 100%;
  margin-top: 8px;
  padding: 4px;
  padding-left: 12px;
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

export const Button = styled.button`
  padding: 8px 0;
  position: relative;
  padding-bottom: 10px;
  width: 50%
  align-self: flex-end;
  background-color: #3919E6;
  background-image: radial-gradient(ellipse farthest-corner at top left , #3919E6 0%, #7B16FF 100%);
  color: #ffffff;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 8px;
  transition: all 0.3s ease-out;

  &:hover {
    transform: scale(1.1);
    border-radius: 6px;
    box-shadow: 0 4px 8px #000000;
    transition: box-shadow 0.2s ease-in, transform 0.2s ease-in, border-radius: 0.2s ease-in 0.1s;
  }
`;