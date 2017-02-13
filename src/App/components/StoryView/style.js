import styled from 'styled-components';
import { Tooltip } from '../../../shared/Globals'

export const Wrapper = styled.div`
	display: flex;
	flex: 0 0 auto;
	background-color: #ffffff;
	padding: 24px;
	max-height: 50vh;
	flex-direction: column;
	box-shadow: 0 4px 16px -8px black;
	overflow-y: auto;
`;

export const Section = styled.div`
	display: flex;
	flex-direction: column;
	justify-self: flex-end;
`;

export const Description = styled.p`
	font-size: 16px;
	display: inline-block;
	margin-bottom: 24px;
	line-height: 1.6;
	color: #363A4F;
`;

export const SectionLabel = styled.h4`
	font-size: 10px;
	display: inline-block;
	text-transform: uppercase;
	color: #9BA6AF;
	margin-top: 24px;
	margin-bottom: 4px;
	font-weight: bold;
`;

export const RowList = styled.div`
	display: flex;
	overflow-x: scroll;
	flex: 0 0 15%;
`;


export const TagList = styled.ul`
	list-style: none;
	display: flex;
	flex: 1 0 auto;
`;

export const Tag = styled.li`
	height: 24px;
	padding: 0 12px;
	line-height: 24px;
	vertical-align: middle;
	border-radius: 12px;
	word-wrap: none;
	white-space: no-wrap;
	background-color: #CBD9ED;
	color: #ffffff;
	text-transform: uppercase;
	font-size: 10px;
	font-weight: bold;
	margin-right: 8px;

	&:last-of-type {
		margin-right: 0;
	}
`;

export const Meta = styled.div`
  display: block;
  overflow: auto;
`

export const AuthorName = styled.span`
  display: inline-block;
  font-size: 12px;
  color: #c2c2c2;
  margin-bottom: 16px;
`

export const Media = styled.img`
	width: 100px;
	margin: 8px 8px 0 0;
	border-radius: 4px;
  border: 2px solid transparent;
  &:hover {
    border-color: #4422ED;
  }
`;

export const HiddenInput = styled.input`
	display: none;
`;

export const Button = styled.button`
	background-color: transparent;
	${props => props.tooltip ? Tooltip(props.tooltip) : console.log(false) };
`