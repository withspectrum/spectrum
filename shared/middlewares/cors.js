// @flow
import cors from 'cors';

export default cors({
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://spectrum.chat',
          'https://admin.spectrum.chat',
          'https://alpha.spectrum.chat',
          /spectrum-(\w|-)+\.now\.sh/g,
          /spectrum\.chat$/,
        ]
      : [/localhost/],
  credentials: true,
});
