import React from 'react';
import MD from 'react-remarkable';

export default ({ children }) => (
  <MD
    options={{
      html: true,
      linkify: true,
    }}
    source={children}
  />
);
