import styled from 'styled-components'
import { Palette, Shadow } from '../../../shared/Globals'

export const ComposerContainer = styled.div`
	display: ${props => props.isOpen ? 'inline-block' : 'none'};
	align-self: stretch;
	flex: 0 0 auto;
	margin: 8px;
	margin-bottom: 0;
	padding: 16px;
	border-radius: 2px;
	background-color: ${Palette.bg.default};
	box-shadow: ${Shadow.low};
	transition: all 0.2s ease-in-out;

	&:hover {
		box-shadow: ${Shadow.mid};
		transition: box-shadow 0.2s ease-out;
		cursor: pointer;
	}
`

export const Input = styled.input`
	outline: none;
	border: 0;
	box-shadow: none;
	background: ${Palette.bg.default};
	display: block;
	margin-bottom: 8px;
	font-size: 1rem;
	width: 100%;
	font-weight: 500;
`

export const Textarea = styled.textarea`
	outline: none;
	border: 0;
	box-shadow: none;
	background: ${Palette.bg.default};
	display: block;
	margin-bottom: 8px;
	font-size: 1rem;
	font-weight: 500;
	resize: none;
	width: 100%;
	font-size: 0.875rem;
`

export const Submit = styled.input`
	display: block;
	background-color: ${Palette.brand.default};
	color: ${Palette.text.reverse};
	outline: none;
	border: 0;
	border-radius: 4px;
	padding: 0.5rem 1rem;
	text-transform: uppercase;
	font-size: 0.75rem;
	font-weight: 600;
	margin-top: 1rem;
	float: right;

	&:hover {
		cursor: pointer;
	}
`

export const Media = styled.img`
	width: 100%;
	border-radius: 4px;
	position: relative;
`

export const MediaWrapper = styled.div`
	position: relative;

	&:hover {
		&:after {
			content: 'Remove';
	    font-size: 10px;
	    font-weight: 600;
	    position: absolute;
	    top: 0;
	    right: 0;
	    width: auto;
	    background: ${Palette.bg.reverse};
	    border-radius: 0 4px 0 4px;
	    padding: 2px 8px 4px;
	    color: ${Palette.text.reverse};
	    text-transform: uppercase;
	    pointer-events: none;
		}
	}
`

export const MediaInput = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`

export const MediaLabel = styled.label`
	width: 100%;
	background: ${Palette.bg.wash};
	border-radius: 4px;
	text-align: center;
	border: 1px dashed rgba(0,0,0,0.1);
	padding: 1rem 2rem;
	display: block;
	font-size: 0.75rem;
	text-transform: uppercase;
	color: ${Palette.text.alt};
	font-weight: 800;

	&:hover {
		cursor: pointer;
	}
`

export const Alert = styled.div`
	display: block;
	margin-top: 1rem;
	border-radius: 4px;
	background: ${Palette.warn.default};
	color: ${Palette.text.reverse};
	font-size: 0.75rem;
	font-weight: 500;
	text-align: center;
	padding: 0.5rem;
	border: 1px solid ${Palette.warn.alt};
`