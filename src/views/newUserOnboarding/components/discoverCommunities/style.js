// @flow
// $FlowFixMe
import styled from 'styled-components';
import {
  Gradient,
  Truncate,
  Transition,
  zIndex,
} from '../../../../components/globals';

export const Row = styled.div`
  width: 100%;
  flex: auto;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  padding: 8px 16px 0 16px;

  @media (max-width: 768px) {
    padding: 8px 0 0;
  }
`;

export const CoverPhoto = styled.div`
  position: relative;
  width: 100%;
  height: ${props => (props.large ? '320px' : '96px')};
  background-color: ${({ theme }) => theme.brand.default};
  background-image: url('${props => props.url}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: ${props => (props.large ? '12px' : '12px 12px 0 0')};
`;

export const Container = styled.div`
  background: #fff;
  box-shadow: inset 0 0 0 2px ${props => props.theme.border.default};
  flex: 0 0 22%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  position: relative;
  z-index: ${zIndex.card};
  margin: 16px;

  @media (max-width: 1168px) {
    flex-basis: 44%;
  }

  @media (max-width: 540px) {
    flex-basis: 100%;
  }
`;

export const ProfileAvatar = styled.img`
  height: 40px;
  width: 40px;
  flex: 0 0 40px;
  margin-right: 16px;
  border-radius: 8px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.generic.default};
  background-image: ${({ theme }) =>
    Gradient(theme.generic.alt, theme.generic.default)};
`;

export const CoverAvatar = styled(ProfileAvatar)`
  border: 2px solid ${({ theme }) => theme.text.reverse};
  width: 64px;
  flex: 0 0 64px;
  margin-right: 0;
  border-radius: 8px;
`;

export const Title = styled.h3`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  font-weight: 700;
  line-height: 1.2;
  ${Truncate} transition: ${Transition.hover.off};
`;

export const CoverTitle = styled(Title)`
  font-size: 16px;
  margin-top: 8px;
  max-width: 100%;
`;

export const CoverDescription = styled.p`
  margin: 0 16px 8px 16px;
  text-align: center;
  font-size: 16px;
  color: ${props => props.theme.text.alt};
  display: flex;
  align-self: stretch;
  flex-direction: column;
  flex: 1;
  line-height: 1.3;
`;

export const ButtonContainer = styled.div`
  padding: 8px 16px 16px;

  button {
    width: 100%;
  }
`;
