import React, { Component } from 'react';
import { track } from '../../EventTracker';
import Icon from '../Icons';
import { truncate } from '../../helpers/utils';
import {
  LinkPreviewContainer,
  LinkPreviewImage,
  LinkPreviewTextContainer,
  MetaTitle,
  MetaDescription,
  MetaUrl,
  Close,
} from './style';

class LinkPreview extends Component {
  remove = e => {
    console.log('is this getting triggered?');
    e.preventDefault();
    this.props.remove();
  };

  render() {
    let {
      data: { author, date, description, image, publisher, title, url },
      trueUrl,
      editable,
    } = this.props;
    author = author ? truncate(author, 32) : '';
    description = description ? truncate(description, 80) : '';
    publisher = publisher ? truncate(publisher, 32) : '';
    title = title ? truncate(title, 72) : '';
    url ? truncate(url, 30) : '';

    return (
      <LinkPreviewContainer
        size={this.props.size}
        padding={image}
        target="_blank"
        rel="noopener"
        href={trueUrl}
      >
        {editable &&
          <Close onClick={this.remove}>
            <Icon size={16} icon="close" subtle color="warn.alt" />
          </Close>}

        {image && <LinkPreviewImage size={this.props.size} image={image} />}

        <LinkPreviewTextContainer padding={image}>
          {title && <MetaTitle>{title}</MetaTitle>}

          {description && <MetaDescription>{description}</MetaDescription>}

          <MetaUrl>
            {url ? url : trueUrl}
          </MetaUrl>
        </LinkPreviewTextContainer>
      </LinkPreviewContainer>
    );
  }
}

export default LinkPreview;
