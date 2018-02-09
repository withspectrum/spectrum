// @flow
import styled from 'styled-components';
import { zIndex, Transition } from '../../components/globals';

export const EmailListItem = styled.div`
  padding: 8px 0 16px;
  border-bottom: 2px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    border-bottom: none;
  }

  input {
    margin-right: 8px;
  }
`;

export const CheckboxContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EmailForm = styled.form`
  display: flex;
  align-items: flex-end;

  button {
    align-self: flex-end;
    margin-left: 16px;
  }
`;

export const SigninButton = styled.a`
  display: flex;
  flex-shrink: 1;
  z-index: ${zIndex.card + 1};
  flex-direction: flex-row;
  align-self: flex-start;
  align-items: center;
  color: ${({ theme }) => theme.text.reverse};
  border-radius: 8px;
  padding: 8px;
  padding-right: 16px;
  font-size: 14px;
  font-weight: 700;
  transition: ${Transition.hover.off};
  position: relative;
  margin: 16px;

  ${props =>
    props.after &&
    `
			&:after {
				content: 'Previously signed in with';
				position: absolute;
				top: -32px;
				font-size: 14px;
				font-weight: 600;
				left: 50%;
				transform: translateX(-50%);
				width: 100%;
				text-align: center;
				color: ${props.theme.text.alt};
			}
		`} span {
    display: inline-block;
    flex: 0 0 auto;
    margin-top: -1px;
    margin-left: 8px;
    line-height: 2.45;
    word-break: keep-all;
    white-space: nowrap;
    color: currentColor;
  }

  svg {
    fill: currentColor !important;
  }

  @media (max-width: 768px) {
    margin: 16px 0;

    ${props =>
      props.after &&
      `
        margin: 48px 0 16px 0;
      `};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const ButtonGithub = styled(SigninButton)`
  background: ${props => (props.preferred ? props.theme.text.default : 'none')};
  color: ${props =>
    props.whitebg
      ? props.theme.text.default
      : props.preferred ? '#fff' : 'rgba(255,255,255,0.8)'};

  &:after {
    color: ${props => props.theme.text.default};
  }

  &:hover {
    color: ${props => (props.whitebg ? props.theme.text.default : '#fff')};
  }
`;
