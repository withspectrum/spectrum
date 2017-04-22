import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.section`
  width: 100%;
`;

export const Nav = styled.nav`
  width: 100%;
  background: #000;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  line-height: 1;
  box-shadow: 0 4px 8px #C9D4E0;

  @media (max-width: 768px) {
    bottom: 0;
    top: auto;
    box-shadow: 0 -4px 8px #C9D4E0;
    padding: 0;
  }
`;

export const Section = styled.span`
  display: flex;
  align-items: center;
  height: 100%;

  @media (max-width: 768px) {
    flex: 1 1 ${props => (props.left ? '60%' : '40%')};
    justify-content: space-around;
  }
`;

export const Spacer = styled.div`
  height: 48px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LogoLink = styled(Link)`
  margin-right: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Logo = styled.img`
  width: 24px;
  height: 24px;
  align-self: center;
`;

export const IconLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 8px;
  padding: 0 8px;
  height: 100%;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  &[data-active~="true"] {
    box-shadow: inset 0 -2px 0 #fff;
    opacity: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    opacity: 0.7;
    margin: 0;

    &[data-mobileWidth~="third"] {
      width: 33%;
    }

    &[data-mobileWidth~="half"] {
      width: 50%;
    }

    &[data-active~="true"] {
      box-shadow: inset 0 0 0 #fff;
      opacity: 1;
    }

    svg {
      width: 24px;
      height: 24px;
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%)!important;
    }
  }
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 700;
  margin-left: 12px;

  @media (max-width: 768px) {
    font-size: 9px;
    text-transform: uppercase;
    font-weight: 700;
    margin-top: 2px;
    margin-left: 0;
  }
`;
