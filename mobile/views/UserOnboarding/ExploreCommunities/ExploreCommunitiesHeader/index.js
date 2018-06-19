// @flow
import * as React from 'react';
import { throttle, debounce } from 'throttle-debounce';
import { Header, SearchBar } from './style';

type Props = {
  onSearch: Function,
  onSearchBlur: Function,
  onSearchFocus: Function,
  joinedCommunities: Array<?string>,
};

type State = {
  wipSearchString: ?string,
};

class ExploreCommunitiesHeader extends React.Component<Props, State> {
  state = {
    wipSearchString: '',
  };
  // buttonOpacity = new Animated.Value(1)
  // buttonScale = new Animated.Value(1)

  constructor() {
    super();
    this.searchDebounced = debounce(300, this.searchDebounced);
    this.searchThrottled = throttle(300, this.searchThrottled);
  }

  onChangeText = (text: string) => {
    this.setState({ wipSearchString: text }, () => {
      const { wipSearchString } = this.state;
      if (wipSearchString && wipSearchString.length < 5) {
        this.searchThrottled(wipSearchString);
      } else {
        this.searchDebounced(wipSearchString);
      }
    });
  };

  onFinishTyping = (e: { nativeEvent: { text: string } }) => {
    this.search(e.nativeEvent.text);
  };

  searchDebounced = (searchString: ?string) => {
    this.search(searchString);
  };

  searchThrottled = (searchString: ?string) => {
    this.search(searchString);
  };

  search = (searchString: ?string) => {
    this.props.onSearch(searchString);
  };

  onFocus = () => {
    const { onSearchFocus } = this.props;
    onSearchFocus();
  };

  onBlur = () => {
    const { onSearchBlur } = this.props;
    onSearchBlur();
  };

  render() {
    return (
      <Header>
        <SearchBar
          placeholder={'Search for communities...'}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChangeText={this.onChangeText}
          onEndEditing={this.onFinishTyping}
          onSubmitEditing={this.onFinishTyping}
          value={this.state.wipSearchString}
          clearButtonMode={'always'}
        />
      </Header>
    );
  }
}

export default ExploreCommunitiesHeader;
