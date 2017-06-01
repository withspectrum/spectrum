// @flow
// $FlowFixMe
import styled from 'styled-components';
import { Gradient, Truncate, Transition } from '../../../components/globals';
import ScrollRow from '../../../components/scrollRow';

export const Row = styled(ScrollRow)`
  max-width: 100%;
  width: 100%;
  flex: 0 0 300px;
  padding: 8px 16px 0 16px;
  overflow-x: scroll;
  align-items: flex-start;

  &:after, &:before{
    content: '';
    display: inline-block;
    flex: 0 0 32px;
    align-self: stretch;
    background-color: transparent;
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
  box-shadow: 0 1px 12px rgba(0,0,0,0.12);
  min-width: 240px;
  border-radius: 12px;

  &:not(:last-child):not(:first-child) {
    margin: 0 16px;
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
  background-image: ${({ theme }) => Gradient(theme.generic.alt, theme.generic.default)};
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
  ${Truncate}
  transition: ${Transition.hover.off};
`;

export const CoverTitle = styled(Title)`
  font-size: 16px;
  margin-top: 8px;
  max-width: 100%;
`;

export const ButtonContainer = styled.div`
  padding: 8px 16px 16px;

  button {
    width: 100%;
  }
`;
