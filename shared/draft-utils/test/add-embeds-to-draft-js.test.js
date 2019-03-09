// @flow
jest.mock('draft-js/lib/generateRandomKey', () => {
  let last = 0;
  const multiplier = Math.exp(24);
  return () => Math.floor(last++ * multiplier).toString(32);
});
import {
  getEmbedsFromText,
  addEmbedsToEditorState,
} from '../add-embeds-to-draft-js';

describe('sites', () => {
  describe('<iframe>', () => {
    it('should handle simple HTML', () => {
      const url = 'https://bla.com';
      const text = `<iframe src="${url}" />`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          url,
        },
      ]);
    });

    it('should handle attributes', () => {
      const url = 'https://bla.com';
      const text = `<iframe src="${url}" height="500px" />`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          url,
        },
      ]);
    });
  });

  describe('vimeo', () => {
    it('should handle standard urls', () => {
      const id = '313662630';
      const text = `https://www.vimeo.com/${id}`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://player.vimeo.com/video/${id}`,
        },
      ]);
    });

    it('should handle urls without https://', () => {
      const id = '313662630';
      const text = `www.vimeo.com/${id}`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://player.vimeo.com/video/${id}`,
        },
      ]);
    });

    it('should handle urls without www', () => {
      const id = '313662630';
      const text = `vimeo.com/${id}`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://player.vimeo.com/video/${id}`,
        },
      ]);
    });

    it('should handle channel urls', () => {
      const id = '313662630';
      const text = `https://www.vimeo.com/channels/staffpicks/${id}`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://player.vimeo.com/video/${id}`,
        },
      ]);
    });

    it('should handle channel urls with numbers and underscores', () => {
      const id = '313662630';
      const text = `https://www.vimeo.com/channels/my_channel123/${id}`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://player.vimeo.com/video/${id}`,
        },
      ]);
    });
  });

  describe('figma', () => {
    it('should handle file urls', () => {
      const text = 'www.figma.com/file/aLQFl2vxHpVRI6yDppNMMH3i/logo';
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://www.figma.com/embed?embed_host=spectrum&url=${text}`,
        },
      ]);
    });

    it('should handle file urls with query strings', () => {
      const text =
        'www.figma.com/file/aLQFl2vxHpVRI6yDppNMMH3i/logo?node-id=0%3A2';
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://www.figma.com/embed?embed_host=spectrum&url=${text}`,
        },
      ]);
    });

    it('should handle prototyping urls', () => {
      const text = 'www.figma.com/proto/aLQFl2vxHpVRI6yDppNMMH3i/logo';
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://www.figma.com/embed?embed_host=spectrum&url=${text}`,
        },
      ]);
    });

    it('should handle prototyping urls with query strings', () => {
      const text =
        'www.figma.com/proto/aLQFl2vxHpVRI6yDppNMMH3i/logo?node-id=0%3A2&scaling=min-zoom';
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://www.figma.com/embed?embed_host=spectrum&url=${text}`,
        },
      ]);
    });

    it('should urls with https', () => {
      const text = 'https://www.figma.com/file/aLQFl2vxHpVRI6yDppNMMH3i/logo';
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://www.figma.com/embed?embed_host=spectrum&url=${text.replace(
            'https://',
            ''
          )}`,
        },
      ]);
    });
  });

  describe('youtube', () => {
    it('should handle video urls', () => {
      const id = '2pMb6RJ7ioU';
      const text = `https://www.youtube.com/watch?v=${id}`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://www.youtube.com/embed/${id}`,
        },
      ]);
    });

    it('should handle youtu.be urls', () => {
      const id = '2pMb6RJ7ioU';
      const text = `https://www.youtu.be/${id}`;
      expect(getEmbedsFromText(text)).toEqual([
        {
          aspectRatio: '56.25%',
          url: `https://www.youtube.com/embed/${id}`,
        },
      ]);
    });
  });

  describe('framer', () => {
    it('should handle prototyping urls', () => {
      const text = 'https://framer.cloud/asdf123';
      expect(getEmbedsFromText(text)).toEqual([
        {
          url: 'https://framer.cloud/asdf123',
          width: 600,
          height: 800,
        },
      ]);
    });

    it('should handle share urls', () => {
      const text = 'https://share.framerjs.com/478kta5wx0wn';
      expect(getEmbedsFromText(text)).toEqual([
        {
          url: 'https://share.framerjs.com/478kta5wx0wn',
          width: 600,
          height: 800,
        },
      ]);
    });
  });

  describe('codepen', () => {
    it('should handle pen URLs', () => {
      const text = 'https://codepen.io/jcoulterdesign/pen/NeOQzX';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 300,
          url: 'https://codepen.io/jcoulterdesign/embed/NeOQzX',
        },
      ]);
    });

    it('should handle full screen view URLs', () => {
      const text = 'https://codepen.io/jcoulterdesign/full/NeOQzX';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 300,
          url: 'https://codepen.io/jcoulterdesign/embed/NeOQzX',
        },
      ]);
    });

    it('should handle details view URLs', () => {
      const text = 'https://codepen.io/jcoulterdesign/details/NeOQzX';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 300,
          url: 'https://codepen.io/jcoulterdesign/embed/NeOQzX',
        },
      ]);
    });

    it('should handle embed URLs', () => {
      const text = 'https://codepen.io/jcoulterdesign/embed/NeOQzX';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 300,
          url: 'https://codepen.io/jcoulterdesign/embed/NeOQzX',
        },
      ]);
    });
  });

  describe('codesandbox', () => {
    it('should handle sandbox urls', () => {
      const text = 'https://codesandbox.io/s/8lz7276xz2';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 500,
          url: 'https://codesandbox.io/embed/8lz7276xz2',
        },
      ]);
    });

    it('should handle sandbox urls with query params', () => {
      const text = 'https://codesandbox.io/s/8lz7276xz2?autoresize=true';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 500,
          url: 'https://codesandbox.io/embed/8lz7276xz2?autoresize=true',
        },
      ]);
    });

    it('should handle embed urls', () => {
      const text = 'https://codesandbox.io/embed/8lz7276xz2';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 500,
          url: 'https://codesandbox.io/embed/8lz7276xz2',
        },
      ]);
    });
  });

  describe('simplecast', () => {
    it('should handle simplecast urls', () => {
      const text = 'https://simplecast.com/s/8fb96767';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 200,
          url: 'https://embed.simplecast.com/8fb96767',
        },
      ]);
    });

    it('should handle simplecast urls with query params', () => {
      const text = 'https://simplecast.com/s/8fb96767?color=000000';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 200,
          url: 'https://embed.simplecast.com/8fb96767?color=000000',
        },
      ]);
    });

    it('should handle embed urls', () => {
      const text = 'https://embed.simplecast.com/8fb96767';
      expect(getEmbedsFromText(text)).toEqual([
        {
          height: 200,
          url: 'https://embed.simplecast.com/8fb96767',
        },
      ]);
    });
  });
});

describe('complex text', () => {
  it('should handle text before and after the URL', () => {
    const text = 'this is cool: vimeo.com/123456 love it!';
    expect(getEmbedsFromText(text)).toEqual([
      {
        url: 'https://player.vimeo.com/video/123456',
        aspectRatio: '56.25%',
      },
    ]);
  });

  it('should handle the same url multiple times', () => {
    const text = 'vimeo.com/123456 vimeo.com/123456 vimeo.com/123456';
    expect(getEmbedsFromText(text)).toEqual([
      {
        url: 'https://player.vimeo.com/video/123456',
        aspectRatio: '56.25%',
      },
    ]);
  });

  it('should handle multiple embeds', () => {
    const text =
      'Hey, look at this vimeo.com/123456 and this: youtu.be/asdf123 wow';
    expect(getEmbedsFromText(text)).toEqual([
      {
        aspectRatio: '56.25%',
        url: 'https://www.youtube.com/embed/asdf123',
      },
      {
        aspectRatio: '56.25%',
        url: 'https://player.vimeo.com/video/123456',
      },
    ]);
  });

  it('should handle a URL and an iframe', () => {
    const text = 'vimeo.com/123456 <iframe src="bla.com" />';
    expect(getEmbedsFromText(text)).toEqual([
      {
        url: 'bla.com',
      },
      {
        url: 'https://player.vimeo.com/video/123456',
        aspectRatio: '56.25%',
      },
    ]);
  });

  it('should handle text without embeds', () => {
    expect(getEmbedsFromText('no embeds here')).toEqual([]);
  });

  it('should handle embeds with duplicate other links (#4778)', () => {
    const text =
      'https://simplecast.com/s/a1f11d11\n\n[Sentry.io](http://www.sentry.io) [Sentry](https://sentry.io)';
    expect(getEmbedsFromText(text)).toEqual([
      {
        height: 200,
        url: 'https://embed.simplecast.com/a1f11d11',
      },
    ]);
  });
});

it('should not change anything if there are not embeds to add', () => {
  const input = {
    blocks: [
      {
        type: 'unstyled',
        key: 'g0000',
        data: {},
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        text: 'Hello world!',
      },
    ],
    entityMap: {},
  };
  expect(addEmbedsToEditorState(input)).toEqual(input);
});

it('should add embeds', () => {
  const input = {
    blocks: [
      {
        type: 'unstyled',
        key: 'g0000',
        data: {},
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        text: 'https://simplecast.com/s/a1f11d11',
      },
    ],
    entityMap: {},
  };
  expect(addEmbedsToEditorState(input)).toMatchSnapshot();
});
