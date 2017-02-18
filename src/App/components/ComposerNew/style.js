import styled from 'styled-components';
import { Gradient, H4 } from '../../../shared/Globals';

export const ScrollBody = styled.div`
	display: flex;
	flex: 1 1 100%;
	background-color: ${({ theme }) => theme.bg.default};
	max-height: 100vh;
	flex-direction: column;
	overflow-y: auto;
`;

export const ContentView = styled.div`
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	padding: 32px;
`;

export const Header = styled.div`
	flex: 1 0 auto;
	align-self: flex-start;
	justify-content: space-between;
	width: 100%;
	display: flex;
	background-color: ${({ theme }) => theme.bg.default};
`;

export const Byline = styled(H4)`
	color: ${({ theme }) => theme.brand.default};
	margin-bottom: 8px;
	position: relative;
	display: inline-block;
`;

export const Select = styled.select`
	color: ${({ theme }) => theme.brand.default};
  border: none;
  border-radius: 3px;
  background: rgba(56, 24, 229, 0.05);
  -webkit-appearance: none;
  font-size: 14px;
  padding: 4px 8px;
  margin-left: 5px;
  position: relative;
 	width: auto;
 	transition: all 0.1s;
 	font-weight: 600;

 	&:hover {
 		transition: all 0.1s;
 		cursor: pointer;
 		background: rgba(56, 24, 229, 0.08);
 	}
`;

export const FlexColumn = styled.div`
	display:flex;
	flex-direction: column;
	width: 100%;
`;

export const Alert = styled.div`
	display: block;
	margin-top: 1rem;
	color: ${({ theme }) => theme.warn.default};
	font-size: 0.75rem;
	font-weight: 600;
`;

export const SubmitContainer = styled.div`
	width: 100%;
	border-top: 1px solid ${props => props.theme.border.default};
	padding: 1rem 0;
`

export const Submit = styled.input`
	background-color: ${props => 
		props.active ? props.theme.brand.default : props.theme.text.placeholder};
  background-image: ${props => 
  	props.active ? Gradient(props.theme.brand.alt, props.theme.brand.default) : props.theme.text.placeholder};
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);

  &:hover {
  	cursor: pointer;
  }
`


// these are style objects because i'm custom styling another react component to handle autoresizign
export const StoryTitle = {
	fontSize: "32px",
	padding: "0",
	outline: "none",
	border: "0",
	lineHeight: "40px",
	fontWeight: "800",
	boxShadow: "none",
	width: "100%",
	color: "#171A21",
	whiteSpace: "pre-wrap"
}

export const TextBody = {
	marginTop: "16px",
	fontSize: "16px",
	width: "100%",
	display: "inline-block",
	marginBottom: "32px",
	lineHeight: "1.6",
	padding: "0",
	outline: "none",
	border: "0",
	boxShadow: "none",
	color: "#171A21",
	whiteSpace: "pre-wrap"
}