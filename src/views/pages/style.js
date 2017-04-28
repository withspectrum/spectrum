import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: ${props => (props.container ? 'column' : 'row')} ;
  padding: ${props => (props.container ? '32px' : '0')};
  width: 100%;
  flex: 0 0 auto;
  border-bottom: 1px solid ${props => (props.container ? props.theme.border.default : 'transparent')};
  flex-wrap: wrap;
`;

export const Heading = styled.h2`
  font-size: 32px;
  font-weight: 900;
  line-height: 1.4;
  display: block;
  margin-bottom: 16px;
  margin-left: 8px;
  color: ${props => props.theme.text.default};
`;

export const Subheading = styled.h3`
  margin-left: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 800;
  color: ${props => props.theme.text.alt};
`;

export const PropsList = styled.ul`
  font-size: 14px;
  font-weight: 400;
  margin-left: 8px;
  margin-bottom: 32px;

  p {
    max-width: 500px;
    margin-top: 4px;
    line-height: 1.6;
  }

  li {
    list-style-type: none;
    margin: 16px 0;
  }

  li:first-child {
    margin-top: 0;
  }

  li:last-child {
    margin-bottom: 0;
  }

  code {
    display: inline;
    background: #EEF1F5;
    border-radius: 4px;
    padding: 0 4px 2px;
    line-height: 1;
    border: 1px solid ${props => props.theme.border.default};
  }

  pre {
    background: #fff;
    border: 1px solid ${props => props.theme.border.default};
    display: inline-block;
    font-size: 14px;
    padding: 2px 8px;
    border-radius: 4px;
  }
`;

export const ComponentContainer = styled.div`
  background: #f6f7f8;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-grow: 1;
  margin: 8px;
  width: calc(${props => (props.width ? `${props.width} - 16px` : `50% - 16px`)});
  max-width: calc(50% - 16px);
`;

export const Component = styled.div`
  background: ${props => (props.reverse ? props.theme.text.default : props.transparent ? 'transparent' : '#fff')};
  padding: 16px;
  border-bottom: 1px solid ${props => (props.reverse ? 'none' : props.theme.border.default)};
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

export const Code = styled.div`
  margin: 8px;
  border-radius: 4px;
  padding: 16px;
  background: #282C34;
  color: #ABB2BF;
  cursor: pointer;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
  width: calc(100% - 16px);

  &::-moz-selection { /* Code for Firefox */
    background: #2C323D;
    color: #ffffff;
  }

  &::selection {
    background: #2C323D;
    color: #ffffff;
  }
`;

export const Swatch = styled.span`
  width: 100%;
  height: 48px;
  border-radius: 4px;
  background-color: ${props => eval(`props.theme.${props.color}`)};
  ${props => (props.color === 'bg.default' || props.color === 'text.reverse' ? `border: 1px solid ${props.theme.border.default}` : '')};
`;

export const Spacer = styled.div`
  height: ${props => props.height};
`;
