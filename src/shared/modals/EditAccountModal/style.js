import styled from 'styled-components';

export const Heading = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const Subheading = styled.p`
  font-size: 14px;
  font-weight: 500;
  ${props =>
  props.success
    ? 'color: #02AAFA; background-image: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
    : `color: ${props.theme.text.alt}`};
  margin-bottom: 24px;
  line-height: 1.4;
`;

export const Or = styled.span`
  text-align: center;
  display: block;
  position: relative;
  margin: 16px 0;
  color: ${({ theme }) => theme.text.alt};

  span {
    background: #fff;
    padding: 4px 8px;
    z-index: 2;
    position: relative;
    top: 3px;
    font-size: 13px;
    font-weight: 600;
  }

  &:after {
    content: '';
    display: block;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.border.default};
    position: absolute;
    top: 17px;
    z-index: 1;
  }
`;

export const Relative = styled.div`
  position: relative;
`;
