import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { SearchInput, SearchForm, SearchInputDiv } from '../style';
import Icon from '../../../components/icons';
import type { Dispatch } from 'redux';
import {
  closeSearch,
  openSearch,
  setSearchStringVariable,
} from '../../../actions/dashboardFeed';

type Props = {
  dispatch: Dispatch<Object>,
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
  constructor(props) {
    super(props);

    this.state = {
      value: props.queryString ? props.queryString : '',
    };
  }

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
    this.searchInput && this.searchInput.focus();
  };

  close = () => {
    if (this.state.value.length === 0) {
      this.props.dispatch(closeSearch());
      this.props.dispatch(setSearchStringVariable(''));
    }
    this.searchInput && this.searchInput.blur();
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
    const { isOpen, filter, darkContext } = this.props;
    const { value } = this.state;

    const placeholder = filter.communityId
      ? 'Search this community...'
      : filter.channelId
        ? 'Search this channel...'
        : 'Search for conversations...';

    return (
      <SearchForm
        onSubmit={this.submit}
        isOpen={isOpen}
        darkContext={darkContext}
      >
        <Icon glyph={'search'} size={24} />
        <SearchInputDiv>
          <SearchInput
            onFocus={this.open}
            onBlur={this.close}
            isOpen={true}
            onChange={this.onChange}
            value={value}
            placeholder={placeholder}
            innerRef={input => {
              this.searchInput = input;
            }}
            darkContext={darkContext}
          />
        </SearchInputDiv>
        <Icon glyph="view-close" size={16} onClick={this.clearClose} />
      </SearchForm>
    );
  }
}

const map = state => ({
  isOpen: state.dashboardFeed.search.isOpen,
  queryString: state.dashboardFeed.search.queryString,
});
// $FlowIssue
export default compose(connect(map))(ThreadSearch);
