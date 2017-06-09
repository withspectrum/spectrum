//$FlowFixMe
import styled from 'styled-components';
//$FlowFixMe
import { Link } from 'react-router-dom';
import { Button } from '../buttons';
import { FlexCol, FlexRow, Shadow, hexa, H1, H4, Transition } from '../globals';

export const FeaturePhoto = styled.img`
  height: 120px;
  width: 120px;
  border-radius: 24px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.brand.alt};
  box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.default, 0.25)};

  @media (max-width: 768px) {
    height: 64px;
    width: 64px;
    border-radius: 12px;
  }
`;

export const Title = styled(H1)`
  font-weight: 800;
  font-size: 2rem;
  line-height: 1;
  color: ${({ theme }) => theme.text.reverse};

  @media (max-width: 768px) {
    font-size: 1.5rem;
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
    margin-top: 0;
    margin-left: 16px;
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
    margin-top: 0;
    margin-left: 16px;
  }
`;

export const FeatureWrapper = styled(FlexCol)`
  position: relative;
  align-self: center;
  z-index: 3;
  color: ${({ theme }) => theme.text.reverse};
`;

export const FeatureLabel = styled(H4)`
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text.reverse};
  text-transform: uppercase;
`;

export const Feature = styled(FlexRow)`
  margin-top: 16px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FeaturePresentation = styled(FlexCol)`
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
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
`;
