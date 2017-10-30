import styled from 'styled-components';
import { FlexRow } from '../globals';

export const StyledControl = styled(FlexRow)`
  align-self: flex-end;
  margin-top: -24px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    background-color: ${props => props.theme.bg.default};
    align-self: stretch;
    margin: 0;
    margin-bottom: 2px;
  }
`;

export const StyledDropdown = styled(select)`
  border: 0;
  outline: 0;
`;

export const StyledSegment = styled(FlexRow)`
  position: relative;
  top: 1px;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1;
  font-size: 16px;
  font-weight: ${props => (props.selected ? '900' : '500')};
  color: ${props =>
    props.selected ? props.theme.text.default : props.theme.text.alt};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.theme.bg.reverse};

  &:hover {
    color: ${props =>
      props.selected ? props.theme.text.default : props.theme.text.default};
  }

  @media (max-width: 768px) {
    flex: auto;
    justify-content: space-around;
  }
`;

const StyledOption = styled(option)``;

export const SegmentedControl = props => {
  const { children } = props;
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return <StyledDropdown>{children}</StyledDropdown>;
  } else {
    return <StyledControl>{children}</StyledControl>;
  }
};

export const Segment = props => {
  const { children, selected, value } = props;
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <StyledOption selected={selected} value={value}>
        {children}
      </StyledOption>
    );
  } else {
    return <StyledSegment selected={selected}>{children}</StyledSegment>;
  }
};
