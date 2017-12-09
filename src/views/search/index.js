import * as React from 'react';
import Link from '../../components/link';
import AlgoliaInput from './algoliaInput';
import { Input } from './style';

type Props = {};
type Hit = {
  id: string,
  title: string,
};
type State = {
  results: Array<Hit>,
  hasError: boolean,
};
class Search extends React.Component<Props, State> {
  initialState = { results: [], hasError: false };
  state = this.initialState;

  onEmptyField = () => this.setState(this.initialState);
  onResults = results => this.setState({ results, hasError: false });
  onError = () => this.setState({ results: [], hasError: true });

  render() {
    const { results } = this.state;
    console.log('results', results);
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AlgoliaInput
          index="dev_users"
          onResults={this.onResults}
          onEmptyField={this.onEmptyField}
          onError={this.onError}
          placeholder={'Search for users...'}
          // filters={'communityId:"-Kh6RfPXoGhg6Gc33-Ux"'}
          StyledComponent={Input}
        />
        {// results.length > 0 && results.map(thread =>
        //   <Link
        //     key={thread.id}
        //     to={{
        //       pathname: window.location.pathname,
        //       search: `?thread=${thread.id}`,
        //     }}>
        //     {thread.content.title}
        //   </Link>
        // )

        results.length > 0 &&
          results.map(user => (
            <Link key={user.id} to={`/users/${user.username}`}>
              {user.name} · @{user.username}
            </Link>
          ))

        // results.length > 0 && results.map(community =>
        //   <Link
        //     key={community.id}
        //     to={`/${community.slug}`}>
        //     {community.name}
        //   </Link>
        // )
        }
      </div>
    );
  }
}

export default Search;
