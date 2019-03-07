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
import { SegmentedControl, Segment } from 'src/components/SegmentedControl';
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
  onKeyDown?: Function,
  isEditing: boolean,
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
    onKeyDown,
    isEditing,
  } = props;

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
        }}
      >
        <Segment isActive={!showPreview} onClick={() => setShowPreview(false)}>
          Write
        </Segment>
        <Segment isActive={showPreview} onClick={() => setShowPreview(true)}>
          Preview
        </Segment>
      </SegmentedControl>
      <ThreadInputs>
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
                  inputRef={bodyRef}
                  placeholder={'Add more thoughts here...'}
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
