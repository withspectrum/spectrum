// @flow
// Renders a thread body to React elements
import React from 'react';
import redraft from 'redraft';
import threadRenderer from 'shared/clients/draft-js/thread/renderer';
import type { RawDraftContentState } from 'draft-js';

type Props = {
  body: RawDraftContentState,
};

export default (props: Props) =>
  console.log(props.body) || (
    <div className="markdown">{redraft(props.body, threadRenderer)}</div>
  );
