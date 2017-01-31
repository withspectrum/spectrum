import styled from 'styled-components';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #171A21;
  width: 16vw;
  min-width: 240px;
  min-height: 100vh;
  height: 100%;
  overflow-y: scroll;
`;

export const Header = styled.div`
  display: flex;
  flex: 0 1 auto;
  padding: 16px;
  padding-top: 0;
  align-items: center;
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
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 2px;
`;

export const MetaLink = styled.a`
  text-decoration: none;
  font-size: 12px;
  color: #747E8D;
  font-weight: 500;

  &:hover {
    cursor: pointer;
  }
`;

export const Input = styled.input`
  background-color: #2E313F;
  border-radius: 4px 0px 0px 4px;
  width: 100%;
  padding: 4px;
  padding-left: 12px;
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

export const FreqList = styled.div`
  list-style: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 0 1 auto;
  overflow-y: scroll;
`;

export const Freq = styled.div`
  display: flex;
  height: 48px;
  padding-left: 16px;
  align-items: center;
  background-color: #171a21;
  transition: background-color 0.2s ease-out;

  &:hover {
    cursor: pointer;
    background-color: #2E313F;
    transition: background-color 0.2s ease-in;
  }
`;

export const FreqActive = styled(Freq)`
  background-color: #3818e5;
  color: rgba(255, 255, 255, 1);
  transition: background-color 0.2s ease-out;

  &:hover {
    cursor: pointer;
    background-color: #3818e5;
    transition: background-color 0.2s ease-in;
  }
`;

export const FreqLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-left: 8px;
  pointer-events: none;
`;

export const FreqIcon = styled.img`
  height: 32px;
  width: 32px;
  pointer-events: none;
`;

export const Footer = styled.div`
  display: flex;
  flex: 0 1 auto;
  width: 100%;
  padding: 0 8px 8px 8px;
  justify-content: space-between;
`;

export const FooterLogo = styled.img`
  height: 24px;
  width: 24px;
`;

export const FooterMeta = styled.p`
  display: flex;
  font-size: 12px;
  color: #747E8D;
  font-weight: 500;
  text-align: right;
`;

export const Form = styled.form`
  margin: 8px;
  margin-bottom: 16px;
  display: flex;
  flex: 0 1 auto;
  align-items: center;
`;

export const Button = styled.button`
  background-color: #3818e5;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  height: 32px;
  width: 40px;
  line-height: 32px;
  text-align: center;
  vertical-align: middle;
  border-left: 2px solid #171a21;
  border-radius: 0px 4px 4px 0px;
`;