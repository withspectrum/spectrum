import styled from 'styled-components';
import { Gradient, H4, H1 } from '../../../shared/Globals';

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

	@media (max-width: 768px) {
		padding: 16px;
	}
`;

export const PreviewWrapper = styled.div`
	padding-bottom: 32px;
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
	color: ${props =>
  props.active ? props.theme.brand.default : props.theme.text.alt};
	border-bottom: 2px solid ${props =>
  props.active ? props.theme.brand.default : 'transparent'};
	margin-bottom: 8px;
	margin-right: 16px;
	margin-bottom: 16px;
	position: relative;
	pointer-events: ${props => props.hasContent ? 'auto' : 'none'};
	opacity: ${props => props.hasContent ? 1 : 0};
	transition: all 0.2s;
	display: inline-block;

	&:hover {
		cursor: pointer;
	}
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

export const Upload = styled.input`
	border: none;
	outline: 0;
	color: ${props => props.theme.brand.default};
	font-weight: 800;
	font-size: 0.75rem;
	margin: 0.5rem 0 1rem;
	background: transparent;
`;

export const SubmitContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	background: #fff;
	border-top: 1px solid ${props => props.theme.border.default};
	padding: ${props => props.sticky ? '1rem' : '1rem 0'};
	position: ${props => props.sticky ? 'absolute' : 'relative'};
	bottom: ${props => props.sticky ? '0' : 'auto'};
	left: ${props => props.sticky ? '0' : 'auto'};
	right: ${props => props.sticky ? '0' : 'auto'};
`;

export const Submit = styled.input`
	background-color: ${props =>
  props.active ? props.theme.brand.default : props.theme.text.placeholder};
  background-image: ${props =>
  props.active
    ? Gradient(props.theme.brand.alt, props.theme.brand.default)
    : props.theme.text.placeholder};
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);

  &:hover {
  	cursor: pointer;
  }
`;

export const MediaInput = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`;

export const MediaLabel = styled.label`
	border: none;
	outline: 0;
	color: ${props => props.theme.brand.default};
	font-weight: 800;
	font-size: 0.75rem;
	display: inline-block;
	margin: 0.5rem 0 1rem;
	background: transparent;

	&:hover {
		cursor: pointer;
	}
`;

// these are style objects because i'm custom styling another react component to handle autoresizign
export const StoryTitle = {
  fontSize: '32px',
  padding: '0',
  outline: 'none',
  border: '0',
  lineHeight: '40px',
  fontWeight: '800',
  boxShadow: 'none',
  width: '100%',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
};

export const StoryTitlePreview = styled(H1)`
	font-size: 32px;
	line-height: 40px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.default};
`;

export const TextBody = {
  marginTop: '16px',
  fontSize: '16px',
  width: '100%',
  display: 'inline-block',
  marginBottom: '32px',
  lineHeight: '1.6',
  padding: '0',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
};

export const BackArrow = styled.span`
	font-size: 20px;
	width: 100%;
	border-bottom: 1px solid ${props => props.theme.border.default};
	background: #fff;
	box-shadow: 0 1px 1px rgba(0,0,0,0.02);
	padding: 1rem;
	display: none;

	@media (max-width: 768px) {
		display: block;
	}
`;

export const EmbedInput = styled.input`
	border: 1px solid transparent;
	outline: 0;
	font-weight: 800;
	font-size: 0.75rem;
	display: inline-block;
	margin: 0.5rem 0 1rem 1rem;
	padding: 8px;
	box-shadow: none;
	width: 200px;

	&:hover {
		cursor: pointer;
	}

	&:focus {
		border-bottom: 1px solid ${props => props.theme.brand.default};
	}

	::-webkit-input-placeholder { /* Chrome/Opera/Safari */
	  color: ${props => props.theme.brand.default};
	}
	::-moz-placeholder { /* Firefox 19+ */
	  color: ${props => props.theme.brand.default};
	}
	:-ms-input-placeholder { /* IE 10+ */
	  color: ${props => props.theme.brand.default};
	}
	:-moz-placeholder { /* Firefox 18- */
	  color: ${props => props.theme.brand.default};
	}
`;
