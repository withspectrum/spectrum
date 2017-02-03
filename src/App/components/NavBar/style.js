import styled from 'styled-components';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #171A21;
  flex-shrink: 0;
  width: 16vw;
  min-width: 240px;
  height: 100vh;
  align-items: stretch;
`;

export const Header = styled.div`
  display: flex;
  flex: 0 0 auto;
  padding: 16px;
  align-items: ${props => props.login ? `flex-start` : `center` };
  flex-direction: ${props => props.login ? `column` : `row` };
`;

export const HeaderLogo = styled.img`
  height: 24px;
  width: 137px;
`;

export const Avatar = styled.img`
  height: 32px;
  flex: 0 0 32px;
  border-radius: 8px;
`;

export const MetaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

export const Name = styled.h3`
  font-size: 16px;
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
  transition: color 0.2s ease-out;

  &:hover {
    cursor: pointer;
    color: #ffffff;
    transition: color 0.2s ease-out;
  }
`;

export const FreqList = styled.div`
  list-style: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 0 1 100%;
  overflow-y: scroll;
  justify-self: stretch;
  margin-bottom: 2rem;
`;

export const FreqListHeading = styled.p`
  font-size: 10px;
  text-transform: uppercase;
  color: #3e4256;
  margin-bottom: 8px;
  margin-left: 16px;
  font-weight: bold;
  letter-spacing: .4px;
`;

export const Freq = styled.div`
  display: flex;
  flex: 0 0 48px;
  padding-left: 16px;
  align-items: center;
  background-color: ${props => props.active ? '#3818e5' : '#171a21' };
  background-image: ${props => props.active ? `radial-gradient(ellipse farthest-corner at top left , #7B16FF 0%, #3819E6 100%)` : `none`};
  color: #fff;  

  &:hover {
    cursor: pointer;
    background-color: ${props => props.active ? '#3818e5' : '#2E313F' };
  }
`;

export const FreqLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-left: 12px;
  pointer-events: none;
`;

export const FreqIcon = styled.img`
  height: 32px;
  width: 32px;
  pointer-events: none;
`;

export const Footer = styled.div`
  display: flex;
  flex: 0 0 auto;
  width: 100%;
  padding: 0 8px 8px 8px;
  align-self: flex-end;
  align-items: center;
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
  flex: 0 0 auto;
`;

export const Input = styled.input`
  background-color: #2E313F;
  border-radius: 4px 0px 0px 4px;
  flex: 1 0 auto;
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

export const Button = styled.button`
  background-color: #3818e5;
  background-image: radial-gradient(ellipse farthest-corner at top left , #7B16FF 0%, #3819E6 100%);
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  height: 32px;
  flex: 0 0 40px;
  line-height: 32px;
  text-align: center;
  vertical-align: middle;
  border-left: 2px solid #171a21;
  border-radius: 0px 4px 4px 0px;
`;