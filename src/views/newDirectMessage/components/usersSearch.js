// @flow
import React, { useState } from 'react';
import { SearchInput, SearchInputWrapper } from '../style';
import UsersSearchResults from './usersSearchResults';

const UsersSearch = (props: Props) => {
  let ref = null;
  const [searchQuery, setSearchQuery] = useState('');

  const onChange = (e: any) => setSearchQuery(e.target.value);
  const onUserSelected = () => {
    setSearchQuery('');
    ref && ref.focus();
  };

  return (
    <React.Fragment>
      <SearchInputWrapper>
        <SearchInput
          ref={el => (ref = el)}
          value={searchQuery}
          onChange={onChange}
          type="text"
          placeholder="Search for people..."
          autoFocus
        />
      </SearchInputWrapper>

      {searchQuery && (
        <UsersSearchResults
          onUserSelected={onUserSelected}
          queryString={searchQuery}
          {...props}
        />
      )}
    </React.Fragment>
  );
};

export default UsersSearch;
