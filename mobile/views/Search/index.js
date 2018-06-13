// @flow
import React, { Component, type ComponentType } from 'react';
import { withTheme } from 'styled-components';
import { View, StyleSheet, Dimensions, TextInput } from 'react-native';
import { TabViewAnimated, SceneMap, TabBar } from 'react-native-tab-view';
import { TabLabel, SearchView } from './style';
import { Constants } from 'expo';
import SearchBar from './SearchBar';
import ThreadsSearchView from './ThreadsSearchView';
import CommunitiesSearchView from './CommunitiesSearchView';
import PeopleSearchView from './PeopleSearchView';
import type { NavigationProps } from 'react-navigation';
import { FullscreenNullState } from '../../components/NullStates';

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
  navigation: NavigationProps,
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
    if (!this.state.searchString)
      return (
        <SearchView>
          <FullscreenNullState
            title={'Search for threads'}
            subtitle={
              'Find topics and conversations across all communities on Spectrum'
            }
            icon={'thread'}
          />
        </SearchView>
      );

    return (
      <ThreadsSearchView
        navigation={this.props.navigation}
        queryString={this.state.searchString}
      />
    );
  };

  renderCommunitiesRoute = () => {
    if (!this.state.searchString)
      return (
        <SearchView>
          <FullscreenNullState
            title={'Search for communities'}
            subtitle={'Discover new communities and topics'}
            icon={'community'}
          />
        </SearchView>
      );

    return (
      <CommunitiesSearchView
        navigation={this.props.navigation}
        queryString={this.state.searchString}
      />
    );
  };

  renderPeopleRoute = () => {
    if (!this.state.searchString)
      return (
        <SearchView>
          <FullscreenNullState
            title={'Search for people'}
            subtitle={'Connect with people on Spectrum'}
            icon={'person'}
          />
        </SearchView>
      );

    return (
      <PeopleSearchView
        onPress={userId =>
          this.props.navigation.navigate({
            routeName: `User`,
            key: userId,
            params: { id: userId },
          })
        }
        queryString={this.state.searchString}
      />
    );
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
        <SearchBar
          autoFocus={false}
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
