import styled from 'styled-components';
import theme from 'shared/theme';
import Card from '../../components/card';
import Link from 'src/components/link';
import {
  FlexCol,
  H1,
  H2,
  H3,
  Span,
  Tooltip,
  tint,
} from '../../components/globals';

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${theme.bg.border};
  padding-bottom: 16px;
`;

export const ListHeading = styled(H3)`
  font-weight: 800;
  font-size: 20px;
  color: ${theme.text.default};
`;

export const ListContainer = styled(FlexCol)`
  margin: 8px -16px 0;
  width: calc(100% + 32px);
`;

export const MoreLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  color: ${theme.brand.alt};
`;

export const StyledCard = styled(Card)`
  padding: 16px 16px 16px 20px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 0 8px;
`;

export const EmailInviteForm = styled.div`
  display: flex;
  align-items: center;

  &:first-of-type {
    margin-top: 16px;
  }
`;

export const EmailInviteInput = styled.input`
  display: flex;
  flex: 1 1 50%;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: 2px solid
    ${props => (props.error ? props.theme.warn.default : props.theme.bg.border)};
  margin-bottom: 8px;
  margin-top: 8px;
  margin-left: 4px;
  margin-right: 4px;

  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    margin-right: 0;
  }

  &:focus {
    border: 2px solid ${theme.brand.default};
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const AddRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 8px;
  background: ${theme.bg.wash};
  margin-top: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${theme.text.alt};
  font-weight: 500;
  border-radius: 4px;

  &:hover {
    color: ${theme.text.default};
    cursor: pointer;
  }
`;

export const RemoveRow = styled.div`
  margin-left: 4px;
  color: ${theme.text.alt};

  &:hover {
    cursor: pointer;
    color: ${theme.text.default};
  }
`;

export const Title = styled(H1)`
  font-size: 20px;
`;

export const Pitch = styled(FlexCol)`
  margin: 0 0 32px 0;
`;

export const PitchItem = styled(FlexCol)`
  display: inline-block;
  font-size: 14px;
  line-height: 1.4;

  div {
    font-size: 32px;
    text-align: center;
    align-self: center;
  }

  p {
    margin-top: 8px;
    text-align: center;
  }

  b {
    font-weight: 700;
  }

  & + & {
    margin-top: 16px;
  }
`;

export const Cost = styled(FlexCol)`
  align-items: center;
  text-align: center;
  justify-content: flex-end;
  flex: none;
`;

export const CostNumber = styled(H2)`
  margin-top: 16px;
  font-size: 44px;
  letter-spacing: -2px;
  vertical-align: baseline;
  position: relative;
  left: -16px;
  color: ${theme.text.default};

  &:before {
    content: '$';
    vertical-align: top;
    position: absolute;
    top: 16px;
    right: calc(100% + 2px);
    font-weight: 400;
    font-size: 20px;
    letter-spacing: normal;
    color: ${theme.text.alt};
  }

  &:after {
    content: ${props => (props.per ? `'/ ${props.per}'` : "''")};
    color: ${theme.text.alt};
    position: absolute;
    font-size: 14px;
    white-space: nowrap;
    left: calc(100% + 4px);
    bottom: 16px;
    font-weight: 500;
    letter-spacing: normal;
  }
`;

export const CostPer = styled(Span)`
  color: ${theme.text.alt};
  position: relative;
  left: -12px;
  font-weight: 500;
  letter-spacing: normal;
`;

export const CostSubtext = styled(FlexCol)`
  color: ${theme.text.alt};
  flex: none;
  margin-bottom: 24px;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 500;
`;

export const View = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const GrowthText = styled.h5`
  color: ${props =>
    props.positive
      ? props.theme.success.default
      : props.negative
      ? props.theme.warn.alt
      : props.theme.text.alt};
  display: inline-block;
  margin-right: 6px;
  font-size: 14px;
`;

export const MessageIcon = styled.div`
  color: ${theme.brand.alt};
  cursor: pointer;
  ${Tooltip} top: 2px;
`;

// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
const getColorFromHexContrast = (hex: string) => {
  hex = hex.replace('#', '');

  let R, G, B, C, L;
  console.log({ hex });

  R = parseInt(hex.substring(0, 2), 16);
  G = parseInt(hex.substring(2, 4), 16);
  B = parseInt(hex.substring(4, 6), 16);

  console.log({ R, G, B });

  C = [R / 255, G / 255, B / 255];

  console.log({ CBefore: C });

  C = C.map(i => {
    if (i <= 0.03928) {
      return i / 12.92;
    } else {
      return Math.pow((i + 0.055) / 1.055, 2.4);
    }
  });

  console.log({ CAfter: C });

  L = 0.2126 * C[0] + 0.7152 * C[1] + 0.0722 * C[2];

  console.log({ L });

  if (L > 0.179) {
    return tint(hex, -80);
  } else {
    return theme.text.reverse;
  }
};

export const ThreadTag = styled.li`
  list-style-type: none;
  padding: 2px 8px 2px 16px;
  border-radius: 4px;
  background: ${props => props.hex};
  display: inline-block;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => getColorFromHexContrast(props.hex)};
`;

export const RemoveTagButton = styled.button`
  font-size: 16px;
  font-weight: 500;
  background: none;
  line-height: 1;
  color: ${props => getColorFromHexContrast(props.hex)};
  cursor: pointer;
  padding: 8px;
  ${Tooltip};
  position: relative;
  top: -1px;
`;
