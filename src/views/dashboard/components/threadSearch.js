import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { SearchWrapper, SearchInput, ClearSearch, SearchForm } from '../style';
import Icon from '../../../components/icons';
import { throttle } from '../../../helpers/utils';
import {
  closeSearch,
  openSearch,
  setSearchStringVariable,
} from '../../../actions/dashboardFeed';

type Props = {
  dispatch: Function,
  filter: {
    communityId?: ?string,
    channelId?: ?string,
    everythingFeed?: ?boolean,
  },
};
type State = {
  value: string,
};
class ThreadSearch extends React.Component<Props, State> {
  state = { value: '' };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = (e: any) => {
    // escape
    if (e.keyCode === 27) {
      if (!this.props.isOpen) return;
      this.close();
    }
  };

  submit = e => {
    e.preventDefault();
    const searchString = this.state.value.toLowerCase().trim();
    if (searchString.length > 0) {
      this.props.dispatch(setSearchStringVariable(searchString));
    }
  };

  open = () => {
    this.props.dispatch(openSearch());
    this.searchInput.focus();
  };

  close = () => {
    if (this.state.value.length === 0) {
      this.props.dispatch(closeSearch());
      this.props.dispatch(setSearchStringVariable(''));
    }
    this.searchInput.blur();
  };

  clearClose = () => {
    this.setState({ value: '' });
    this.props.dispatch(setSearchStringVariable(''));
    this.searchInput.focus();
  };

  onChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { isOpen, filter } = this.props;
    const { value } = this.state;

    const placeholder = filter.communityId
      ? 'Search this community...'
      : filter.channelId
        ? 'Search this channel...'
        : 'Search your communities...';

    return (
      <SearchWrapper isOpen={isOpen}>
        <Icon glyph={'search'} size={32} onClick={this.open} />
        <ClearSearch
          onClick={this.clearClose}
          isVisible={isOpen && value.length > 0}
          isOpen={isOpen}
        >
          <span>&times;</span>
        </ClearSearch>
        <SearchForm onSubmit={this.submit}>
          <SearchInput
            isOpen={isOpen}
            onBlur={this.close}
            onChange={this.onChange}
            value={value}
            placeholder={placeholder}
            innerRef={input => {
              this.searchInput = input;
            }}
          />
        </SearchForm>
      </SearchWrapper>
    );
  }
}

const map = state => ({ isOpen: state.dashboardFeed.search.isOpen });
export default compose(connect(map))(ThreadSearch);
