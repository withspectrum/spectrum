// @flow
import * as React from 'react';
import ReactS3Uploader from 'react-s3-uploader';
import compose from 'recompose/compose';
import { getSignedS3Url } from 'shared/graphql/mutations/s3';

type Props = {
  id: string,
  getSignedS3Url: Function,
};

class MediaUploader extends React.Component<Props> {
  uploadInput: React.Node;

  onUploadStart = (file: any, next: Function) => {
    console.log('upload start');
    return next(file);
  };

  onUploadProgress = () => {
    console.log('upload progress');
  };

  onUploadError = () => {
    console.log('upload error');
  };

  onUploadFinish = () => {
    console.log('upload finished');
  };

  getSignedUrl = (file: any, callback: Function) => {
    console.log('getting signed url');
    const input = {
      objectName: file.name,
      contentType: file.type,
      entityType: 'threads',
      id: this.props.id,
    };

    this.props
      .getSignedS3Url(input)
      .then(data => {
        console.log('data', data);
        return callback(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <form>
        <ReactS3Uploader
          getSignedUrl={this.getSignedUrl}
          accept="image/*"
          s3path="/uploads/"
          preprocess={this.onUploadStart}
          onProgress={this.onUploadProgress}
          onError={this.onUploadError}
          onFinish={this.onUploadFinish}
          uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
          contentDisposition="auto"
          scrubFilename={filename => filename.replace(/[^\w\d_\-.]+/gi, '')}
          inputRef={cmp => (this.uploadInput = cmp)}
          autoUpload={true}
        />
      </form>
    );
  }
}

export default compose(getSignedS3Url)(MediaUploader);
