// flow-typed signature: ac5dc0012761b322fb7609d0b5f27e30
// flow-typed version: da30fe6876/lru-cache_v4.0.x/flow_>=v0.25.0

declare module "lru-cache" {
  declare type LRUCache<K, V> = {
    set: (key: K, value: V, maxAge?: number) => void,
    get: (key: K) => V,
    peek: (key: K) => V,
    del: (key: K) => void,
    reset: () => void,
    has: (key: K) => boolean
    // TODO add the rest of the things documented at https://www.npmjs.com/package/lru-cache
  };

  declare type Options<K, V> = {
    max?: number,
    maxAge?: number,
    length?: (value: V, key: K) => number,
    dispose?: (key: K, value: V) => void,
    stale?: boolean
  };

  // TODO You can supply just an integer (max size), or even nothing at all.
  declare module.exports: <K, V>(options: Options<K, V>) => LRUCache<K, V>;
}
