import React from 'react';
import Helmet from 'react-helmet';

type Props = {
  title?: string,
  description?: string,
  showUnreadFavicon?: boolean,
  image?: string,
};

let renderCount = 0;
export default ({ title, description, showUnreadFavicon, image }: Props) => {
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

      {showUnreadFavicon ? (
        <link
          rel="shortcut icon"
          id="dynamic-favicon"
          href={`${process.env
            .PUBLIC_URL}/img/favicon_unread.ico?v=${renderCount++}`}
        />
      ) : (
        <link
          rel="shortcut icon"
          id="dynamic-favicon"
          href={`${process.env.PUBLIC_URL}/img/favicon.ico?v=${renderCount++}`}
        />
      )}
    </Helmet>
  );
};
