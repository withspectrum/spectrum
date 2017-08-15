//$FlowFixMe
import styled from 'styled-components';
//$FlowFixMe
import { Link } from 'react-router-dom';
import { Button } from '../buttons';
import {
  FlexCol,
  FlexRow,
  Shadow,
  hexa,
  H1,
  H4,
  Transition,
  zIndex,
} from '../globals';

export const FeaturePhoto = styled.img`
  height: 120px;
  width: 120px;
  border-radius: 24px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.brand.alt};
  box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.default, 0.25)};

  @media (max-width: 768px) {
    height: 240px;
    width: 240px;
    border-radius: 48px;
    align-self: center;
  }
`;

export const Title = styled(H1)`
  font-weight: 800;
  font-size: 2rem;
  line-height: 1;
  color: ${({ theme }) => theme.text.reverse};

  @media (max-width: 768px) {
    font-size: 1.5rem;
    align-self: stretch;
    text-align: center;
    display: inline-block;
    flex: auto;
  }
`;

export const ProfileLink = styled(Link)`
  display: flex;
  align-items: baseline;

  > div {
    align-items: center;
    font-size: 14px;
    line-height: 1;
    font-weight: 700;
    margin-left: 4px;
    padding: 8px 8px 8px 12px;
    border-radius: 8px;
    transition: ${Transition.hover.off};
    background-color: transparent;

    > div {
      transition: ${Transition.hover.off};
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover {
    > div {
      margin-left: 8px;
      background-color: ${({ theme }) => theme.bg.default};
      color: ${({ theme }) => theme.brand.alt};
      transition: ${Transition.hover.on};

      > div {
        margin-left: 8px;
        transition: ${Transition.hover.on};
      }
    }
  }

  @media (max-width: 768px) {
    align-self: stretch;
  }
`;

export const JoinButton = styled(Button)`
  margin-top: 16px;
  flex: none;
  border-radius: 12px;
  padding: 4px;
  box-shadow: ${Shadow.mid} ${({ theme }) => hexa(theme.text.default, 0.25)};

  &:hover {
    box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.default, 0.5)};
  }

  @media (max-width: 768px) {
    align-self: center;
    margin-top: 24px;
  }
`;

export const MemberButton = styled(Button)`
  margin-top: 16px;
  flex: none;
  border-radius: 12px;
  padding: 4px;
  background-color: ${({ theme }) => theme.brand.alt};
  color: ${({ theme }) => hexa(theme.text.reverse, 0.95)};
  cursor: default;

  &:hover {
    box-shadow: none;
    background-color: ${({ theme }) => theme.brand.alt};
  }

  @media (max-width: 768px) {
    align-self: center;
    margin-top: 24px;
  }
`;

export const FeatureWrapper = styled(FlexCol)`
  position: relative;
  align-self: center;
  z-index: ${zIndex.base + 1};
  color: ${({ theme }) => theme.text.reverse};
`;

export const FeatureLabel = styled(H4)`
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text.reverse};
  text-transform: uppercase;

  @media (max-width: 768px) {
    align-self: center;
    text-align: center;
  }
`;

export const Feature = styled(FlexRow)`
  margin-top: 16px;
  align-items: flex-start;

  > a, > button {
    display: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    > a, > button {
      display: flex;
      align-self: center;
    }
  }
`;

export const FeaturePresentation = styled(FlexCol)`
  align-items: center;

  > a:nth-of-type(2), > button {
    display: flex;
  }

  @media (max-width: 768px) {
    align-self: stretch;
    flex-direction: row;
    justify-content: center;

    > a:nth-of-type(2), > button {
      display: none;
    }
  }
`;

export const FeatureDescription = styled(FlexCol)`
  margin-left: 24px;
  align-items: flex-start;
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 16px;
  }
`;

export const Description = styled.p`
  max-width: 480px;
  color: ${({ theme }) => theme.text.reverse};
  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

export const NullDescription = styled(Description)`
  max-width: 480px;
  color: ${({ theme }) => theme.text.reverse};

  @media (max-width: 768px) {
    text-align: center;
    width: 100%;
  }
`;

export const Tag = styled.span`
  margin-top: 24px;
  margin-bottom: 8px;
  padding: 8px 10px;
  line-height: 1;
  border: 2px solid ${({ theme }) => theme.bg.default};
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text.reverse};

  @media (max-width: 768px) {
    align-self: center;
    text-align: center;
  }
`;
