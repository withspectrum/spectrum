// @flow
import React, { Component } from 'react';
import Icon from '../icons';
import { truncate } from '../../helpers/utils';
import {
  LinkPreviewContainer,
  LinkPreviewImage,
  LinkPreviewTextContainer,
  MetaTitle,
  MetaDescription,
  MetaUrl,
  Close,
  LinkPreviewSkeleton,
  AnimatedBackground,
  CoverTop,
  CoverMiddle,
  CoverMiddleMiddle,
  CoverMiddleTopRight,
  CoverLeft,
  CoverMiddleBottomRight,
  CoverBottom,
  CoverMiddleMiddleBottomRight,
} from './style';

export class LinkPreview extends Component {
  remove = e => {
    e.preventDefault();
    this.props.remove();
  };

  render() {
    let {
      data: { description, image, title, url, trueUrl },
      editable,
      margin,
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
        margin={margin}
      >
        {editable &&
          <Close onClick={this.remove}>
            <Icon size={16} glyph="view-close" subtle color="warn.alt" />
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

export const LinkPreviewLoading = () => {
  return (
    <LinkPreviewSkeleton>
      <AnimatedBackground />
      <CoverLeft />
      <CoverTop />
      <CoverMiddle />
      <CoverMiddleMiddle />
      <CoverMiddleTopRight />
      <CoverMiddleBottomRight />
      <CoverMiddleMiddleBottomRight />
      <CoverBottom />
    </LinkPreviewSkeleton>
  );
};
