import styled from 'styled-components';

export const View = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  flex: auto;
  max-height: 100vh;
  overflow: hidden;
`;

export const SearchWrapper = styled.div`
  color: ${props => props.theme.text.alt};
  display: flex;
  align-items: center;
  flex: none;
  transition: all 0.2s;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translate(-4px, -50%);
    cursor: pointer;
    border-radius: 40px;
  }
`;

export const SearchInput = styled.input`
  padding: 20px;
  padding-left: 40px;
  font-size: 16px;
  display: flex;
  flex: 1;
  transition: all 0.2s;
  color: ${props => props.theme.text.alt};
  padding-right: 40px;

  &:focus {
    color: ${props => props.theme.text.default};
  }
`;

export const ClearSearch = styled.span`
  width: 24px;
  height: 24px;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.bg.border};
  border-radius: 50%;
  font-size: 20px;
  position: absolute;
  right: 4px;
  top: 50%;
  color: ${props => props.theme.text.alt};
  transform: translate(-4px, -50%);
  font-weight: 500;
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.text.alt};
    color: ${props => props.theme.text.reverse};
  }

  span {
    position: relative;
    top: -2px;
  }
`;

export const SearchStringHeader = styled.div`
  background: #fff;
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.bg.border};
`;

export const SearchForm = styled.form`
  display: flex;
  flex: 1;
`;
