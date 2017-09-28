// flow-typed signature: c1bd04fbd22ec1a035ddf9f29c05396a
// flow-typed version: 838df4e5fd/query-string_v5.x.x/flow_>=v0.32.x

declare module 'query-string' {
  declare type ArrayFormat = 'none' | 'bracket' | 'index';
  declare type ParseOptions = {|
    arrayFormat?: ArrayFormat,
  |};

  declare type StringifyOptions = {|
    arrayFormat?: ArrayFormat,
    encode?: boolean,
    strict?: boolean,
  |};

  declare module.exports: {
    extract(str: string): ?string,
    parse(str: string, opts?: ParseOptions): Object,
    stringify(obj: Object, opts?: StringifyOptions): string,
  };
}
