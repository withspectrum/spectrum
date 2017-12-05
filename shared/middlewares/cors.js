// @flow
import cors from 'cors';

export default cors({
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://spectrum.chat',
          /spectrum-(\w|-)+\.now\.sh/g,
          /spectrum\.chat$/,
        ]
      : [
          'http://localhost:3000',
          'http://localhost:3006',
          'http://localhost:4000',
        ],
  credentials: true,
});
