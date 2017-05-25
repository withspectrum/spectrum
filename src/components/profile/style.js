import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FlexRow, FlexCol, Truncate, Transition, Gradient } from '../globals';
import { Button, OutlineButton, IconButton } from '../buttons';

export const ProfileHeader = styled(FlexRow)`
  padding: 16px;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
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

export const ProfileHeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex: 1 1 auto;
  min-width: 0;

  &:hover h3 {
    transition: ${Transition.hover.on};
    color: ${props => props.theme.brand.alt};
  }
`;

export const ProfileHeaderMeta = styled(FlexCol)`
  flex: 1 1 auto;
  flex-wrap: nowrap;
  min-width: 0;
`;

export const ProfileHeaderAction = styled(IconButton)`
  margin-left: 16px;
  flex: 0 0 auto;
`;

export const Title = styled.h3`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  font-weight: 700;
  line-height: 1.2;
  ${Truncate}
  transition: ${Transition.hover.off};
`;

export const Subtitle = styled.h4`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  line-height: 1.3;
  ${Truncate}
`;

export const Description = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text.default};
  padding: 0 16px 16px;
  line-height: 1.4;
`;

export const ExtLink = styled(FlexRow)`
  margin-top: 8px;
  align-items: center;
  color: ${({ theme }) => theme.brand.alt};
  font-weight: 600;
  transition: ${Transition.hover.off};

  > a:hover {
    text-decoration: underline;
    transition: ${Transition.hover.on};
  }

  > div {
    color: ${({ theme }) => theme.text.placeholder};
    margin-right: 4px;
    margin-left: -4px;
    margin-top: 1px;
  }
`;

export const Actions = styled(FlexRow)`
  padding: 16px;
  padding-top: 0;
  flex: 1 0 100%;
  justify-content: flex-end;
`;

export const Action = styled(Button)`

  &:last-of-type:not(:first-of-type) {
    margin-left: 8px;
  }
`;

export const ActionOutline = styled(OutlineButton)`
  flex-grow: 1;

  &:last-of-type:not(:first-of-type) {
    margin-left: 8px;
  }
`;

export const Meta = styled.div`
  background: #F8FBFE;
  border-top: 2px solid ${props => props.theme.border.default};
  padding: 8px 16px;
  width: 100%;
  border-radius: 0 0 12px 12px;
`;

export const MetaList = styled.ul`

`;

export const MetaListItem = styled.li`
  list-style-type: none;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  padding: 8px 0;
  border-top: 2px solid ${props => props.theme.border.default};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:first-child {
    border-top: none;
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

export const Label = styled.span`
  display: flex;
  align-items: center;

  /* icon */
  div {
    margin-right: 8px;
  }
`;

export const Count = styled.span`
  font-weight: 700;
`;
