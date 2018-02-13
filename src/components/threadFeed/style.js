// @flow
// $FlowFixMe
import styled from 'styled-components';
import { OutlineButton } from '../buttons';

export const FetchMoreButton = styled(OutlineButton)`
  width: 100%;
  padding: 16px 0;

  @media (max-width: 768px) {
    padding: 32px 0;
    border-radius: 0;
    background: #fff;
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.brand.default};
    border: none;
    box-shadow: none;
    border-top: 2px solid ${props => props.theme.bg.border};

    &:hover {
      background: ${props => props.theme.bg.wash};
      border-radius: 0;
      box-shadow: none;
    }
  }
`;

export const Divider = styled.div`
  border-bottom: 2px solid ${props => props.theme.bg.border};
  width: 100%;
  display: block;
  padding-top: 24px;
  margin-bottom: 24px;
`;

export const Upsell = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: flex-start;
  max-width: 100%;
  padding: 64px 32px;

  a {
    color: ${props => props.theme.brand.alt};
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    color: ${props => props.theme.text.default};
    margin-top: 16px;
    font-size: 16px;
    line-height: 1.5;
    max-width: 640px;

    &:first-of-type {
      margin-top: 32px;
    }

    b {
      font-weight: 700;
    }

    ul {
      padding: 16px 0;
      padding-left: 32px;

      li {
        margin-top: 8px;
      }
    }
  }
`;

export const UpsellHeader = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.brand.alt};

  div {
    margin-right: 8px;
  }

  h3 {
    font-weight: 800;
    font-size: 24px;
  }
`;

export const UpsellFooter = styled.div``;
