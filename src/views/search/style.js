import styled from 'styled-components';
import theme from 'shared/theme';

export const View = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  flex: auto;
  max-height: 100vh;
  overflow: hidden;
`;

export const SearchWrapper = styled.div`
  color: ${theme.text.alt};
  display: flex;
  flex: none;
  align-items: center;
  align-self: flex-start;
  transition: all 0.2s;
  border-bottom: 1px solid ${theme.bg.border};
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
  transition: color 0.2s;
  color: ${theme.text.alt};
  padding-right: 40px;

  &:focus {
    color: ${theme.text.default};
  }
`;

export const ClearSearch = styled.span`
  width: 24px;
  height: 24px;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${theme.bg.border};
  border-radius: 50%;
  font-size: 20px;
  position: absolute;
  right: 4px;
  top: 50%;
  color: ${theme.text.alt};
  transform: translate(-4px, -50%);
  font-weight: 500;
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${theme.text.alt};
    color: ${theme.text.reverse};
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
  border-bottom: 1px solid ${theme.bg.border};
`;

export const SearchForm = styled.form`
  display: flex;
  flex: 1;
`;
