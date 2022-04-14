import React, { Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { View, ListWrapper } from './style';
import { recentCommunitiesQuery } from '../../api/community';
import { Loading } from '../../components/loading';
import Search from './components/search';
import CommunityList from './components/communityList';
import CommunityContainer from './containers/community';

class CommunitiesViewIndex extends Component {
  render() {
    const { recent, match } = this.props;
    const dataExists = recent.networkStatus === 7 && recent.recentCommunities;

    if (recent.loading) {
      return <Loading />;
    }

    if (recent.error) {
      return <div>Error</div>;
    }

    if (match.params.slug) {
      return (
        <View>
          <Search />
          <CommunityContainer slug={match.params.slug} />
        </View>
      );
    } else {
      return (
        <View>
          <Search />

          {dataExists && (
            <ListWrapper>
              <CommunityList
                data={recent.recentCommunities}
                label="Recently created"
              />
            </ListWrapper>
          )}
        </View>
      );
    }
  }
}

export default compose(recentCommunitiesQuery, pure)(CommunitiesViewIndex);
