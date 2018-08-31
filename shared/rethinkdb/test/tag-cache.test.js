// @flow
import TagCache from '../tag-cache';

it('should have get, set and invalidate', () => {
  const cache = new TagCache();
  expect(cache.set).toBeDefined();
  expect(cache.get).toBeDefined();
  expect(cache.invalidate).toBeDefined();
});

it('should get and set items', async () => {
  const cache = new TagCache();
  await cache.set('a', 'data', ['tag-1', 'tag-2']);
  expect(await cache.get('a')).toEqual('data');
});

it('should invalidate an item with a tag', async () => {
  const cache = new TagCache();
  await cache.set('a', 'data', ['tag-1']);
  expect(await cache.get('a')).toEqual('data');
  await cache.invalidate(['tag-1']);
  expect(await cache.get('a')).toEqual(null);
});

it('should invalidate multiple items with the same tag', async () => {
  const cache = new TagCache();
  await cache.set('a', 'data', ['tag-1', 'tag-2']);
  await cache.set('b', 'data', ['tag-2', 'tag-3']);
  await cache.set('c', 'data', ['tag-3', 'tag-4']);
  await cache.invalidate(['tag-2']);
  expect(await cache.get('a')).toEqual(null);
  expect(await cache.get('b')).toEqual(null);
  expect(await cache.get('c')).toEqual('data');
});

describe('data types', () => {
  it('should handle objects', async () => {
    const cache = new TagCache();
    await cache.set('a', { id: 'asdf-123' }, ['tag-1']);
    expect(await cache.get('a')).toEqual({ id: 'asdf-123' });
  });

  it('should handle arrays', async () => {
    const cache = new TagCache();
    await cache.set('a', ['1', '2'], ['tag-1']);
    expect(await cache.get('a')).toEqual(['1', '2']);
  });

  it('should handle arrays of objects', async () => {
    const cache = new TagCache();
    await cache.set('a', [{ id: 'asdf-123' }, { id: 'asdf-234' }], ['tag-1']);
    expect(await cache.get('a')).toEqual([
      { id: 'asdf-123' },
      { id: 'asdf-234' },
    ]);
  });
});
