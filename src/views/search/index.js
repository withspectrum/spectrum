import * as React from 'react';
import Link from '../../components/link';
import AlgoliaInput from './algoliaInput';
import ThreadsAlgoliaInput from './gqlAlgoliaInput';
import { Input } from './style';

type Props = {};
type Hit = {
  id: string,
  title: string,
};
type State = {
  results: Array<Hit>,
  gqlResults: Array<any>,
  hasError: boolean,
};
class Search extends React.Component<Props, State> {
  initialState = { results: [], gqlResults: [], hasError: false };
  state = this.initialState;

  onEmptyField = () => this.setState(this.initialState);
  onResults = results => this.setState({ results, hasError: false });
  onError = () => this.setState({ results: [], hasError: true });

  onGQLEmptyField = () => this.setState(this.initialState);
  onGQLResults = gqlResults => this.setState({ gqlResults, hasError: false });

  render() {
    const { results, gqlResults } = this.state;
    console.log('gqlResults', gqlResults);
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ThreadsAlgoliaInput
          onResults={this.onGQLResults}
          onEmptyField={this.onGQLEmptyField}
          onError={this.onError}
          placeholder={'Search for conversations...'}
          StyledComponent={Input}
          filter={{}}
        />

        {gqlResults.length > 0 &&
          gqlResults.map(thread => (
            <Link
              key={thread.id}
              to={{
                pathname: window.location.pathname,
                search: `?thread=${thread.id}`,
              }}
            >
              {thread.content.title}
            </Link>
          ))}
      </div>
    );
  }
}

export default Search;

/* <AlgoliaInput
          index="dev_threads_and_messages"
          onResults={this.onResults}
          onEmptyField={this.onEmptyField}
          onError={this.onError}
          placeholder={'Search for conversations...'}
          // filters={'communityId:"-Kh6RfPXoGhg6Gc33-Ux"'}
          StyledComponent={Input}
        /> */
// results.length > 0 && results.map(thread =>
//   <Link
//     key={thread.id}
// to={{
//   pathname: window.location.pathname,
//   search: `?thread=${thread.id}`,
// }}>
//     {thread.content.title}
//   </Link>
// )

// results.length > 0 &&
//   results.map(user => (
//     <Link key={user.id} to={`/users/${user.username}`}>
//       {user.name} · @{user.username}
//     </Link>
//   ))

// results.length > 0 && results.map(community =>
//   <Link
//     key={community.id}
//     to={`/${community.slug}`}>
//     {community.name}
//   </Link>
// )

// results.length > 0 &&
//   results.map(thread => (
//     <Link key={thread.threadId}
//       to={{
//         pathname: window.location.pathname,
//         search: `?thread=${thread.threadId}`,
//       }}
//     >
//       {thread.threadId}
//     </Link>
//   ))
// }
