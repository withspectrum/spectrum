import React, { Component } from 'react';
import Icon from '../Icons';
import { truncate } from '../../helpers/utils';
import { track } from '../../helpers/events';
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
    e.preventDefault();
    this.props.remove();
  };

  trackClick = () => {
    track('link preview', 'clicked', null);
  };

  render() {
    let {
      data: { description, image, title, url } = {},
      trueUrl,
      editable,
    } = this.props;
    description = description ? truncate(description, 80) : '';
    title = title ? truncate(title, 72) : '';

    return (
      <LinkPreviewContainer
        size={this.props.size}
        padding={image}
        target="_blank"
        rel="noopener"
        href={trueUrl}
        onClick={this.trackClick}
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
