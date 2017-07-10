import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FlexCol,
  FlexRow,
  Transition,
  Shadow,
  hexa,
  Gradient,
} from '../globals';
import Card from '../card';

export const StyledThreadFeedCard = styled(Card)`
  padding: 16px 20px 16px 20px;
  margin-bottom: 16px;
  transition: ${Transition.hover.off};

  @media (max-width: 768px) {
    margin: 0;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &:hover {
    transition: none;
    box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.default, 0.1)};
  }
`;

export const CardLink = styled(Link)`
  position: absolute;
  display: inline-block;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

export const CardContent = styled(FlexCol)`
  align-self: flex-start;
  position: relative;
  z-index: 2;
  align-items: flex-start;
  pointer-events: none;
  width: 100%;
`;

export const Title = styled.h2`
  font-weight: 800;
  font-size: 20px;
  line-height: 1.4;
  flex: 0 0 auto;
  color: ${({ theme }) => theme.text.default};
  pointer-events: all;
`;

export const MetaRow = styled(FlexRow)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

export const ParticipantHeads = styled(FlexRow)`
  align-items: center;

  > *:not(:first-child) {
    margin-left: 4px;
    pointer-events: all;
  }
`;

export const Creator = styled.div`
  height: 2rem;
  width: 2rem;
  padding: 1px;
  border-radius: 100%;
  border: 2px solid ${({ theme }) => theme.brand.alt};
  pointer-events: all;
  display: flex;
  flex: none;
  justify-content: center;
  align-items: center;

  object:after {
    right: -6px;
    bottom: -1px;
  }
`;

export const Meta = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  vertical-align: middle;
  color: ${({ theme }) => theme.text.alt};
  display: flex;
  align-items: center;

  div {
    margin-right: 4px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

export const MetaNew = styled(Meta)`
  font-weight: 700;
  color: ${({ theme }) => theme.success.default};
`;

export const ParticipantCount = styled.span`
  height: 1.5rem;
  padding: 0 8px;
  margin-left: 4px;
  border-radius: .75rem;
  font-size: 11px;
  font-weight: 700;
  vertical-align: middle;
  color: ${({ theme }) => theme.text.reverse};
  background-color: ${({ theme }) => theme.brand.alt};
`;

export const Location = styled.span`
  display: inline-block;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.alt};

  > a {
    pointer-events: all;
  }

  > a:hover {
    color: ${({ theme }) => theme.brand.alt};
    text-decoration: underline;
  }
`;

export const Lock = styled.span`
  position: relative;
  top: 1px;
`;
