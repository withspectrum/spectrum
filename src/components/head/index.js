import React from 'react';
import Helmet from 'react-helmet-async';
import { generateHeaderImageFromImgix } from '../../helpers/images';

type Props = {
  title?: string,
  description?: string,
  image?: string,
  children?: any,
};

export default ({ title, description, image, children }: Props) => {
  const metaImage =
    image ||
    generateHeaderImageFromImgix(
      'https://spectrum.chat/img/apple-icon-144x144-precomposed.png'
    );

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="og:image" content={metaImage} />
      {children}
    </Helmet>
  );
};
