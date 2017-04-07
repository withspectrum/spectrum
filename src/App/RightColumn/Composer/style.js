import styled, { keyframes } from 'styled-components';
import { Gradient, H4, H1 } from '../../../shared/Globals';

export const ScrollBody = styled.div`
	display: flex;
	flex: 1 1 100%;
	background-color: ${({ theme }) => theme.bg.default};
	max-height: 100%;
	flex-direction: column;
	overflow-y: scroll;
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
	margin-right: 16px;
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
  border-radius: ${props => props.right ? '0 4px 4px 0' : '4px 0 0 4px'};
  background: rgba(56, 24, 229, 0.05);
  -webkit-appearance: none;
  font-size: 14px;
  padding: 4px 8px;
  margin-right: ${props => props.right ? '5px' : '0'};
  position: relative;
 	width: auto;
 	transition: all 0.1s;
 	font-weight: 600;
	border: 1px solid rgba(56, 24, 229, 0.1);
	border-right: ${props => props.right ? 'auto' : 'none'};

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
  -webkit-display: none;

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
  marginTop: '16px',
};

export const StoryTitlePreview = styled(H1)`
	font-size: 32px;
	line-height: 40px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.default};
	margin-top: 16px;
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

export const MiniGallery = styled.div`
	width: 100%;
	display: flex;
	overflow-x: scroll;
	background: #f6f7f8;
	padding: 0 16px;
`;

export const MiniImageContainer = styled.span`
	display: inline-block;
	max-width: 4rem;
	max-height: 4rem;
	border-radius: 2px;
	border-radius: 2px;
	margin-right: 16px;
	margin-top: 16px;
	margin-bottom: 16px;
	position: relative;
`;

export const Delete = styled.span`
	position: absolute;
	top: -8px;
	right: -8px;
	width: 16px;
	height: 16px;
	border-radius: 8px;
	background: #000;
	z-index: 3;
	transition: background 0.2s;
	color: #fff;
	padding-left: 5px;
	font-weight: 900;
	font-size: 8px;
	line-height: 2.1;

	&:hover {
		transition: background 0.2s;
		background: ${props => props.theme.warn.default};
		cursor: pointer;
	}
`;

export const Image = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 2px;
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

export const LinkPreviewSkeleton = styled.div`
	display: flex;
	flex-direction: row;
	align-items:  center;
	border-radius: 4px;
	background: #fff;
	border: 1px solid ${({ theme }) => theme.border.default};
	box-shadow: 0 1px 2px rgba(0,0,0,0.08);
	overflow: hidden;
	position: relative;
	height: 140px;
	z-index: 2;
`;

const placeHolderShimmer = keyframes`
	0%{
			background-position: -600px 0
	}
	100%{
			background-position: 600px 0
	}
`;

export const AnimatedBackground = styled.div`
	width: 100%;
	height: 100%;
	animation-duration: 2s;
	animation-fill-mode: forwards;
	animation-iteration-count: infinite;
	animation-name: ${placeHolderShimmer};
	animation-timing-function: linear;
	background: #f6f7f8;
	background: linear-gradient(to right, #f6f7f8 8%, #F0F1F3 18%, #f6f7f8 33%);
	background-size: 100% 140px;
	position: relative;
	z-index: 3;
`;

const Cover = styled.div`
	position: absolute;
	background: #fff;
	z-index: 4;
`;

export const CoverLeft = styled(Cover)`
	left: 140px;
	width: 24px;
	height: 100%;
`;

export const CoverTop = styled(Cover)`
	right: 0;
	top: 0;
	height: 40px;
	width: calc(100% - 152px);
`;

export const CoverMiddle = styled(Cover)`
	right: 0;
	top: 52px;
	height: 16px;
	width: calc(100% - 152px);
`;

export const CoverMiddleMiddle = styled(Cover)`
	right: 0;
	top: 80px;
	height: 20px;
	width: calc(100% - 152px);
`;

export const CoverMiddleTopRight = styled(Cover)`
	right: 0;
	top: 34px;
	height: 20px;
	width: calc(100% - 482px);
`;

export const CoverMiddleBottomRight = styled(Cover)`
	right: 0;
	top: 64px;
	height: 20px;
	width: calc(100% - 342px);
`;

export const CoverMiddleMiddleBottomRight = styled(Cover)`
	right: 0;
	top: 88px;
	height: 20px;
	width: calc(100% - 382px);
`;

export const CoverBottom = styled(Cover)`
	right: 0;
	bottom: 0;
	height: 30px;
	width: calc(100% - 152px);
`;
