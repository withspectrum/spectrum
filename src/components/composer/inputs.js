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
} from './style';
import { ThreadHeading } from 'src/views/thread/style';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import MentionsInput from 'src/components/mentionsInput';
import ThreadRenderer from '../threadRenderer';
import processThreadContent from 'shared/draft-utils/process-thread-content';

type Props = {
  title: string,
  body: string,
  changeBody: Function,
  changeTitle: Function,
  uploadFiles: Function,
  autoFocus?: boolean,
  bodyRef?: Function,
};

export default (props: Props) => {
  // $FlowIssue
  const [showPreview, setShowPreview] = React.useState(false);

  const {
    title,
    body,
    uploadFiles,
    autoFocus,
    changeBody,
    changeTitle,
    bodyRef,
  } = props;

  return (
    <ThreadInputs>
      <SegmentedControl
        css={{
          marginRight: 0,
          marginLeft: 0,
          marginTop: 0,
          marginBottom: '24px',
        }}
      >
        <Segment selected={!showPreview} onClick={() => setShowPreview(false)}>
          Write
        </Segment>
        <Segment selected={showPreview} onClick={() => setShowPreview(true)}>
          Preview
        </Segment>
      </SegmentedControl>
      {showPreview ? (
        /* $FlowFixMe */
        <RenderWrapper>
          <ThreadHeading>{title}</ThreadHeading>
          <ThreadRenderer
            body={JSON.parse(processThreadContent('TEXT', body))}
          />
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
                refKey: 'innerRef',
              })}
            >
              <input {...getInputProps()} />
              <Textarea
                data-cy="composer-title-input"
                onChange={changeTitle}
                style={ThreadTitle}
                value={title}
                placeholder={'What‘s on your mind?'}
                autoFocus={autoFocus}
              />

              <MentionsInput
                onChange={changeBody}
                value={body}
                style={ThreadDescription}
                inputRef={props.bodyRef}
                placeholder={'Add more thoughts here...'}
                className={'threadComposer'}
                dataCy="rich-text-editor"
              />
              <DropImageOverlay visible={isDragActive} />
            </DropzoneWrapper>
          )}
        </Dropzone>
      )}
    </ThreadInputs>
  );
};
