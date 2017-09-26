// @flow
import * as React from 'react';
import { FillSpaceError, LargeEmoji, Heading, Subheading } from './style';
import { Button } from '../buttons';
import { removeItemFromStorage } from '../../helpers/localStorage';

/*
  A generic error component which will fill the space of any container its placed in.
  It requires a heading and subheading to be used to inform the error about why this error is being shown.

  It receives optional props that can help fix a user's problem or nudge them towards resolution:
  - clearStorage: if this prop is present, we will clear the local storage on the client which will then prompt them to re-login on the next page load.
  - refresh: if this prop is present, we will show a button that the user can click to refresh the view. This will most often be used in conjunction with clearStorage
  - children: the error component can receive any other miscellaneous children in order to customize the error view based on the context it's in
*/
type Props = {
  emoji?: string,
  heading?: string,
  subheading?: string,
  clearStorage?: boolean,
  refresh?: boolean,
  children?: React.Node,
  small?: boolean,
};

class ViewError extends React.Component<Props> {
  render() {
    const {
      clearStorage,
      heading,
      subheading,
      refresh,
      emoji,
      children,
      small,
    } = this.props;

    if (clearStorage) {
      removeItemFromStorage('spectrum');
    }

    const moji = emoji || '😌';
    const head = heading || 'We could all use a refresh.';
    const subhead = subheading || 'Refresh this page to try again.';

    return (
      <FillSpaceError small={small}>
        <LargeEmoji small={small} role="img" aria-label="Emoji">
          {moji}
        </LargeEmoji>
        <Heading small={small}>{head}</Heading>
        <Subheading small={small}>{subhead}</Subheading>

        {refresh && (
          <Button
            large={!small}
            icon="view-reload"
            onClick={() => window.location.reload(true)}
          >
            Refresh the page
          </Button>
        )}

        {children}
      </FillSpaceError>
    );
  }
}

export default ViewError;
