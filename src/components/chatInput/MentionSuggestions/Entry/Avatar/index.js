import React from 'react';

const Avatar = ({ mention, theme = {} }) => {
  if (mention.avatar) {
    return (
      <img
        src={mention.avatar}
        className={theme.mentionSuggestionsEntryAvatar}
        role="presentation"
      />
    );
  }

  return null;
};

export default Avatar;
