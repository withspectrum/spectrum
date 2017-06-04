// @flow
import React from 'react';
import Helmet from 'react-helmet';

type Props = {
  title: string,
  description: string,
};

export default ({ title, description }: Props) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="og:title" content={title} />
    <meta name="og:description" content={description} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  </Helmet>
);
