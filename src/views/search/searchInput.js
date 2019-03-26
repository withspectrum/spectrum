import * as React from 'react';
import compose from 'recompose/compose';
import { SearchWrapper, SearchInput, ClearSearch, SearchForm } from './style';
import Icon from 'src/components/icon';

type Props = {};
type State = {
  isOpen: boolean,
  value: string,
  searchQueryString: string,
};
class SearchViewInput extends React.Component<Props, State> {
  state = { isOpen: false, value: '', searchQueryString: '' };

  open = () => {
    this.setState({ isOpen: true });
    this.searchInput.focus();
  };

  close = () => {
    if (this.state.value.length === 0) {
      this.setState({ isOpen: false, searchQueryString: '' });
    }
    this.searchInput.blur();
  };

  clearClose = () => {
    this.setState({ value: '', searchQueryString: '' });
    this.searchInput.focus();
  };

  onChange = e => {
    this.setState({ value: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const searchString = this.state.value.toLowerCase().trim();
    this.props.handleSubmit(searchString);
  };

  render() {
    const { value, isOpen } = this.state;
    const placeholder = 'Search for conversations...';

    return (
      <SearchWrapper isOpen={isOpen} onClick={this.open}>
        <Icon glyph={'search'} size={32} />
        <ClearSearch
          onClick={this.clearClose}
          isVisible={isOpen && value.length > 0}
          isOpen={isOpen}
        >
          <span>&times;</span>
        </ClearSearch>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchInput
            isOpen={isOpen}
            onBlur={this.close}
            onChange={this.onChange}
            value={value}
            placeholder={placeholder}
            ref={input => {
              this.searchInput = input;
            }}
            autoFocus={true}
          />
        </SearchForm>
      </SearchWrapper>
    );
  }
}

export default compose()(SearchViewInput);
