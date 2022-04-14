// @flow
import React, { useMemo } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { withApollo } from 'react-apollo';
import { merge } from 'lodash';
import { MentionsInputStyle } from './style';
import MentionSuggestion from './mentionSuggestion';
import { searchUsersQuery } from 'shared/graphql/queries/search/searchUsers';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import type { ApolloClient } from 'apollo-client';

type Props = {
  value: string,
  onChange: string => void,
  staticSuggestions?: Array<UserInfoType>,
  client: ApolloClient,
  placeholder?: string,
  hasAttachment?: boolean,
  onFocus?: Function,
  onBlur?: Function,
  onKeyDown?: Function,
  inputRef?: Function,
  dataCy?: string,
  networkDisabled?: boolean,
  style: Object,
};

const cleanSuggestionUserObject = (user: ?Object) => {
  if (!user) return null;
  return {
    ...user,
    id: user.username,
    display: user.username,
    filterName: user.name.toLowerCase(),
  };
};

const sortSuggestions = (a, b, queryString) => {
  const aUsernameIndex = a.username.indexOf(queryString || '');
  const bUsernameIndex = b.username.indexOf(queryString || '');
  const aNameIndex = a.filterName.indexOf(queryString || '');
  const bNameIndex = b.filterName.indexOf(queryString || '');
  if (aNameIndex === 0) return -1;
  if (aUsernameIndex === 0) return -1;
  if (aNameIndex === 0) return -1;
  if (aUsernameIndex === 0) return -1;
  return aNameIndex - bNameIndex || aUsernameIndex - bUsernameIndex;
};

const SpectrumMentionsInput = (props: Props) => {
  const searchUsers = async (queryString, callback) => {
    const staticSuggestions = !props.staticSuggestions
      ? []
      : props.staticSuggestions
          .map(cleanSuggestionUserObject)
          .filter(Boolean)
          .filter(user => {
            return (
              user.username &&
              (user.username.indexOf(queryString || '') > -1 ||
                user.filterName.indexOf(queryString || '') > -1)
            );
          })
          .sort((a, b) => {
            return sortSuggestions(a, b, queryString);
          })
          .slice(0, 8);

    callback(staticSuggestions);

    if (!queryString || queryString.length === 0)
      return callback(staticSuggestions);

    const {
      data: { search },
    } = await props.client.query({
      query: searchUsersQuery,
      variables: {
        queryString,
        type: 'USERS',
      },
    });

    if (!search || !search.searchResultsConnection) {
      if (staticSuggestions && staticSuggestions.length > 0)
        return staticSuggestions;
      return;
    }

    let searchUsers = search.searchResultsConnection.edges
      .filter(Boolean)
      .filter(edge => edge.node.username)
      .map(edge => {
        const user = edge.node;
        return cleanSuggestionUserObject(user);
      });

    // Prepend the filtered participants in case a user is tabbing down right now
    const fullResults = [...staticSuggestions, ...searchUsers];
    const uniqueResults = [];
    const done = [];

    fullResults.forEach(item => {
      if (done.indexOf(item.username) === -1) {
        uniqueResults.push(item);
        done.push(item.username);
      }
    });

    return callback(uniqueResults.slice(0, 8));
  };

  const {
    dataCy,
    networkDisabled,
    staticSuggestions,
    hasAttachment,
    ...rest
  } = props;

  const style = useMemo(() => {
    return merge({}, props.style, MentionsInputStyle);
  }, [props.style]);

  return (
    <MentionsInput
      markup="@[__id__]"
      data-cy={props.dataCy}
      {...rest}
      style={style}
      allowSuggestionsAboveCursor
    >
      <Mention
        trigger="@"
        data={searchUsers}
        appendSpaceOnAdd={true}
        displayTransform={username => `@${username}`}
        renderSuggestion={(
          entry,
          search,
          highlightedDisplay,
          index,
          focused
        ) => (
          <MentionSuggestion
            entry={entry}
            highlightedDisplay={highlightedDisplay}
            focused={focused}
            search={search}
            index={index}
          />
        )}
      />
    </MentionsInput>
  );
};

export default withApollo(SpectrumMentionsInput);
