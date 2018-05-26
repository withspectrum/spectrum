// @flow
import React, { Component, type ComponentType } from 'react';
import { withTheme } from 'styled-components';
import { View, StyleSheet, Dimensions, TextInput } from 'react-native';
import { TabViewAnimated, SceneMap, TabBar } from 'react-native-tab-view';
import { TabLabel, SearchView } from './style';
import { Constants } from 'expo';
import SearchInput from '../../components/SearchInput';
import ThreadsSearchView from './ThreadsSearchView';
import CommunitiesSearchView from './CommunitiesSearchView';
import PeopleSearchView from './PeopleSearchView';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

type TabView = {
  key: string,
  title: string,
};

type State = {
  searchString: ?string,
  index: number,
  routes: Array<TabView>,
};

type Props = {
  theme: Object,
};

class Search extends Component<Props, State> {
  searchInput: ComponentType<TextInput>;

  state = {
    searchString: '',
    index: 0,
    routes: [
      { key: 'threads', title: 'Threads' },
      { key: 'communities', title: 'Communities' },
      { key: 'people', title: 'People' },
    ],
  };

  renderThreadsRoute = () => {
    const { index, routes } = this.state;
    if (routes[index].key !== 'threads') return <SearchView />;
    if (!this.state.searchString) return <SearchView />;
    return <ThreadsSearchView queryString={this.state.searchString} />;
  };

  renderCommunitiesRoute = () => {
    const { index, routes } = this.state;
    if (routes[index].key !== 'communities') return <SearchView />;
    if (!this.state.searchString) return <SearchView />;
    return <CommunitiesSearchView queryString={this.state.searchString} />;
  };

  renderPeopleRoute = () => {
    const { index, routes } = this.state;
    if (routes[index].key !== 'people') return <SearchView />;
    if (!this.state.searchString) return <SearchView />;
    return <PeopleSearchView queryString={this.state.searchString} />;
  };

  handleIndexChange = (index: number) => this.setState({ index });

  renderTabs = (props: any) => {
    const active = this.state.index === props.navigationState.index;
    return (
      <TabBar
        indicatorStyle={{
          backgroundColor: '#000',
          height: StyleSheet.hairlineWidth,
        }}
        renderLabel={props => (
          <TabLabel active={active}>{props.route.title}</TabLabel>
        )}
        style={{
          backgroundColor: '#fff',
          paddingTop: Constants.statusBarHeight,
        }}
        useNativeDriver
        {...props}
      />
    );
  };

  handleChange = (e: any) => {
    this.setState({ searchString: e.nativeEvent.text });
  };

  renderHeader = (props: any) => {
    const Tabs = () => this.renderTabs(props);
    return (
      <View>
        <SearchInput
          autoFocus={true}
          blurOnSubmit={true}
          placeholder={`Search for ${this.state.routes[
            this.state.index
          ].title.toLowerCase()}`}
          returnKeyType={'search'}
          clearButtonMode={'always'}
          onEndEditing={this.handleChange}
          onSubmitEditing={this.handleChange}
        />
        <Tabs />
      </View>
    );
  };

  render() {
    const renderScene = SceneMap({
      threads: this.renderThreadsRoute,
      communities: this.renderCommunitiesRoute,
      people: this.renderPeopleRoute,
    });

    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={renderScene}
        renderHeader={this.renderHeader}
        onIndexChange={this.handleIndexChange}
        initialLayout={initialLayout}
        useNativeDriver
      />
    );
  }
}

export default withTheme(Search);
