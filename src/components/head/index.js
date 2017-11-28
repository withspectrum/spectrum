import React from 'react';
import Helmet from 'react-helmet';

type Props = {
  title?: string,
  description?: string,
  image?: string,
  children?: any,
};

export default ({ title, description, image, children }: Props) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={
          image
            ? image
            : 'https://spectrum.chat/img/apple-icon-144x144-precomposed.png'
        }
      />
      <meta
        name="og:image"
        content={
          image
            ? image
            : 'https://spectrum.chat/img/apple-icon-144x144-precomposed.png'
        }
      />
      {children}
    </Helmet>
  );
};
