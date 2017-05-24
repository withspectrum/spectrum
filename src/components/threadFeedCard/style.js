import styled from 'styled-components';
import { FlexCol, FlexRow, Transition, Shadow, hexa } from '../globals';
import Card from '../card';

export const StyledThreadFeedCard = styled(Card)`
  padding: 16px 20px 16px 20px;
  margin-bottom: 16px;
  transition: ${Transition.hover.off};

  &:hover {
    transition: ${Transition.hover.on};
    box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.placeholder, 0.5)};
  }
`;

export const CardContent = styled(FlexCol)`
  width: 100%;
`;

export const Title = styled.h2`
  font-weight: 800;
  font-size: 20px;
  line-height: 1.4;
  color: ${({ theme }) => theme.text.default};
`;

export const Description = styled.p`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: ${({ theme }) => theme.text.default};
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

  > a {
    margin-left: 4px;
    margin-top: 4px;
  }
`;

export const Participant = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  background-size: cover;
`;

export const Creator = styled.div`
  height: 2rem;
  width: 2rem;
  padding: 0.125rem;
  border-radius: 100%;
  border: 2px solid ${({ theme }) => theme.brand.alt};
`;

export const Meta = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  vertical-align: middle;
  color: ${({ theme }) => theme.text.alt};
`;

export const Location = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.alt};
`;
