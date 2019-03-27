// @flow
import React from 'react';
import Textarea from 'react-textarea-autosize';
import Dropzone from 'react-dropzone';
import {
  ThreadInputs,
  DropzoneWrapper,
  ThreadTitle,
  ThreadDescription,
  DropImageOverlay,
  RenderWrapper,
  InputsGrid,
} from './style';
import { ThreadHeading } from 'src/views/thread/style';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import MentionsInput from 'src/components/mentionsInput';
import ThreadRenderer from '../threadRenderer';

type Props = {
  title: string,
  body: ?string,
  changeBody: Function,
  changeTitle: Function,
  uploadFiles: Function,
  autoFocus?: boolean,
  bodyRef?: Function,
  onKeyDown?: Function,
  isEditing: boolean,
};

export default (props: Props) => {
  // $FlowIssue
  const [showPreview, setShowPreview] = React.useState(false);
  // $FlowIssue
  const [previewBody, setPreviewBody] = React.useState(null);

  const {
    title,
    body,
    uploadFiles,
    autoFocus,
    changeBody,
    changeTitle,
    bodyRef,
    onKeyDown,
    isEditing,
  } = props;

  const onClick = (show: boolean) => {
    setShowPreview(show);

    if (show) {
      setPreviewBody(null);
      fetch('https://convert.spectrum.chat/from', {
        method: 'POST',
        body,
      })
        .then(res => {
          if (res.status < 200 || res.status >= 300)
            throw new Error('Oops, something went wrong');
          return res.json();
        })
        .then(json => {
          setPreviewBody(json);
        });
    }
  };

  return (
    <InputsGrid isEditing={isEditing}>
      <SegmentedControl
        css={{
          margin: '0',
          position: 'sticky',
          top: '0',
          left: '0',
          right: '0',
          zIndex: '9999',
          background: '#FFF',
          minHeight: '52px',
        }}
      >
        <Segment isActive={!showPreview} onClick={() => onClick(false)}>
          Write
        </Segment>
        <Segment isActive={showPreview} onClick={() => onClick(true)}>
          Preview
        </Segment>
      </SegmentedControl>
      <ThreadInputs>
        {showPreview ? (
          /* $FlowFixMe */
          <RenderWrapper>
            <ThreadHeading>{title}</ThreadHeading>
            {previewBody === null ? (
              <p>Loading...</p>
            ) : (
              <ThreadRenderer body={previewBody} />
            )}
          </RenderWrapper>
        ) : (
          <Dropzone
            accept={['image/gif', 'image/jpeg', 'image/png', 'video/mp4']}
            disableClick
            multiple={false}
            onDropAccepted={uploadFiles}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <DropzoneWrapper
                {...getRootProps({
                  refKey: 'ref',
                })}
              >
                <input {...getInputProps()} />
                <Textarea
                  data-cy="composer-title-input"
                  onChange={changeTitle}
                  style={ThreadTitle}
                  value={title}
                  placeholder="What do you want to talk about?"
                  autoFocus={autoFocus}
                />

                <MentionsInput
                  onChange={changeBody}
                  value={body === null ? 'Loading...' : body}
                  disabled={body === null}
                  style={ThreadDescription}
                  inputRef={bodyRef}
                  placeholder="Elaborate here if necessary (optional)"
                  className={'threadComposer'}
                  dataCy="rich-text-editor"
                  onKeyDown={onKeyDown}
                />
                <DropImageOverlay visible={isDragActive} />
              </DropzoneWrapper>
            )}
          </Dropzone>
        )}
      </ThreadInputs>
    </InputsGrid>
  );
};
