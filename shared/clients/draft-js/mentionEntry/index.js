import React from 'react';
import { UserAvatar } from 'src/components/avatar/userAvatar';
import Img from 'react-image';

const MentionEntry = props => {
  const {
    mention,
    theme,
    isFocused, // eslint-disable-line no-unused-vars
    searchValue, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <Img
        src={[mention.avatar, '/img/default_avatar.svg']}
        className={theme.mentionSuggestionsEntryAvatar}
        role="presentation"
      />
      <span className={theme.mentionSuggestionsEntryText}>{mention.name}</span>
    </div>
  );
};

export { MentionEntry };
