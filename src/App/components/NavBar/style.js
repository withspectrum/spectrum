import styled from 'styled-components';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #171A21;
  width: 16vw;
  min-height: 100vh;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  margin: 8px;
  padding: 8px;
  align-items: center;
  border-radius: 8px;
`;

export const Avatar = styled.img`
  height: 32px;
  width: 32px;
  clip-path: url(#avatar-32);
`;

export const MetaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

export const Name = styled.h3`
  font-size: 16px;
  color: #ffffff;
  font-weight: 500;
`;

export const Logout = styled.h4`
  font-size: 12px;
  color: #747E8D;
  font-weight: 500;
  margin-top: 2px;
`;

export const TopicSearch = styled.input`
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