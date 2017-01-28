import styled from 'styled-components';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #171A21;
  width: 16vw;
  min-height: 100vh;
  height: 100%;
`;

export const Avatar = styled.img`
  height: 32px;
  width: 32px;
  clip-path: url(#avatar-32);
`;

export const UserHeader = styled.div`
  display: flex;
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

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  margin-top: -2px;
`;

export const Name = styled.h3`
  font-size: 16px;
  color: #ffffff;
  font-weight: 500;
`;

export const Username = styled.h4`
  font-size: 12px;
  color: #747E8D;
  font-weight: 500;
`;

export const TopicSearch = styled.input`
  background-color: #2E313F;
  border-radius: 4px;
  height: 24px;
  margin: 8px;
  margin-top: 0;
  padding: 8px;
  font-weight: 500;
  font-size: 12px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 24px;
  vertical-align: middle;
  color: #ffffff;

  &::placeholder { color: #747E8D }
  &::-webkit-input-placeholder { color: #747E8D }
  &:-moz-placeholder { color: #747E8D }
  &:-ms-input-placeholder { color: #747E8D }
`;