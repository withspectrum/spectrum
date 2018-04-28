// @flow
import getMentions from '../get-mentions';

it('should return a mention', () => {
  expect(getMentions('Hey @mxstbr whassup')).toEqual(['mxstbr']);
});

it('should return multiple mentions', () => {
  expect(getMentions('Hey @mxstbr @bryn whassup')).toEqual(['mxstbr', 'bryn']);
});

it('should remove duplicate mentions', () => {
  expect(getMentions('Hey @mxstbr @bryn @mxstbr whassup')).toEqual([
    'mxstbr',
    'bryn',
  ]);
});

it('should work at the beginning of a string', () => {
  expect(getMentions('@mxstbr whassup')).toEqual(['mxstbr']);
});

it('should work at the end of a string', () => {
  expect(getMentions('Hey @bryn')).toEqual(['bryn']);
});

it('should ignore commas after mentions', () => {
  expect(getMentions('Hey @bryn, whassup?')).toEqual(['bryn']);
});

it('should match underscores', () => {
  expect(getMentions('Hey @brian_lovin whassup')).toEqual(['brian_lovin']);
});

it('should match minusses', () => {
  expect(getMentions('Hey @brian-lovin whassup')).toEqual(['brian-lovin']);
});

it('should ignore parenthesis before mentions', () => {
  expect(getMentions('It is Bryn! (@bryn look)')).toEqual(['bryn']);
});

it('should match mention in Japanese', () => {
  expect(getMentions('の@mxstbrに到着を待っている')).toEqual(['mxstbr']);
});

it('should extract mention before newline', () => {
  expect(getMentions('@mxstbr\n@bryn')).toEqual(['mxstbr', 'bryn']);
});

it('should not extract username from medium link with @', () => {
  expect(
    getMentions(
      'https://medium.com/@probablyup/introducing-buttermilk-fc0b8c6d92af'
    )
  ).toEqual([]);
});

it('should extract username after link ending in /', () => {
  expect(
    getMentions(
      'https://medium.com/@probablyup/introducing-buttermilk-fc0b8c6d92af/ @bryn'
    )
  ).toEqual(['bryn']);
});

describe.skip('failing tests', () => {
  it('should not extract username preceded by !', () => {
    expect(getMentions('f!@kn')).toEqual([]);
  });

  it('should not extract username preceded by @', () => {
    expect(getMentions('f@@kn')).toEqual([]);
  });

  it('should not extract username preceded by #', () => {
    expect(getMentions('f#@kn')).toEqual([]);
  });

  it('should not extract username preceded by $', () => {
    expect(getMentions('f$@kn')).toEqual([]);
  });

  it('should not extract username preceded by %', () => {
    expect(getMentions('f%@kn')).toEqual([]);
  });

  it('should not extract username preceded by &', () => {
    expect(getMentions('f&@kn')).toEqual([]);
  });

  it('should not extract username preceded by *', () => {
    expect(getMentions('f*@kn')).toEqual([]);
  });

  it('should not extract username ending in @', () => {
    expect(getMentions('Current Status: @_@ (cc: @bryn)')).toEqual(['bryn']);
  });
});
