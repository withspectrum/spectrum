// flow-typed signature: 8199b1c780133e0e23f622a5a6d85a88
// flow-typed version: da30fe6876/ioredis_v3.x.x/flow_>=v0.46.x

// @flow
// Flowtype definitions for ioredis
// Project: https://github.com/luin/ioredis
// Definitions by: York Yao <https://github.com/plantain-00/>
//                 Christopher Eck <https://github.com/chrisleck>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//
// Ported to Flow by Samuel Reed <https://github.com/strml>

/* =================== USAGE ===================
    import * as Redis from "ioredis";
    const redis = new Redis();
 =============================================== */

declare module "ioredis" {
  declare class Commander extends events$EventEmitter {
    getBuiltinCommands(): string[];
    createBuiltinCommand(commandName: string): {};
    defineCommand(
      name: string,
      definition: {
        numberOfKeys?: number,
        lua?: string
      }
    ): any;
    sendCommand(): void;
  }

  declare class Redis extends Commander {
    constructor(port?: number, host?: string, options?: RedisOptions): void;
    constructor(host?: string, options?: RedisOptions): void;
    constructor(options: RedisOptions): void;
    constructor(url: string): void;

    status:
      | "close"
      | "disconnecting"
      | "wait"
      | "connecting"
      | "connect"
      | "ready"
      | "end";
    connect(callback?: Function): Promise<any>;
    disconnect(): void;
    duplicate(): Redis;
    monitor(
      callback?: (error: Error, monitor: events$EventEmitter) => void
    ): Promise<events$EventEmitter>;

    send_command(command: string, ...args: any[]): any;
    auth(password: string, callback?: ResCallbackT<any>): Promise<any>;
    ping(callback?: ResCallbackT<number>): Promise<number>;
    append(
      key: string,
      value: string,
      callback?: ResCallbackT<number>
    ): Promise<number>;
    bitcount(key: string, callback?: ResCallbackT<number>): Promise<number>;
    bitcount(
      key: string,
      start: number,
      end: number,
      callback?: ResCallbackT<number>
    ): Promise<number>;
    set(
      key: string,
      value: string,
      nx?: "NX",
      ex?: "EX",
      expires?: number,
      callback?: ResCallbackT<string>
    ): Promise<string>;
    get(key: string, callback?: ResCallbackT<string>): Promise<string>;
    exists(
      key: string,
      value: string,
      callback?: ResCallbackT<number>
    ): Promise<number>;
    publish(channel: string, value: any): Promise<void>;
    subscribe(channel: string): Promise<void>;
    psubscribe(channel: string): Promise<void>;
    getBuffer(key: string, callback?: ResCallbackT<Buffer>): Promise<Buffer>;

    // These are mostly stubbed, TODO
    setnx(args: any[], callback: ResCallbackT<any>): void;
    setnx(...args: any[]): Promise<any>;
    setex(args: any[], callback: ResCallbackT<any>): void;
    setex(...args: any[]): Promise<any>;
    psetex(args: any[], callback: ResCallbackT<any>): void;
    psetex(...args: any[]): Promise<any>;
    append(args: any[], callback: ResCallbackT<any>): void;
    append(...args: any[]): Promise<any>;
    strlen(args: any[], callback: ResCallbackT<any>): void;
    strlen(...args: any[]): Promise<any>;
    del(args: any[], callback: ResCallbackT<any>): void;
    del(...args: any[]): Promise<any>;
    exists(args: any[], callback: ResCallbackT<any>): void;
    exists(...args: any[]): Promise<any>;
    setbit(args: any[], callback: ResCallbackT<any>): void;
    setbit(...args: any[]): Promise<any>;
    getbit(args: any[], callback: ResCallbackT<any>): void;
    getbit(...args: any[]): Promise<any>;
    setrange(args: any[], callback: ResCallbackT<any>): void;
    setrange(...args: any[]): Promise<any>;
    getrange(args: any[], callback: ResCallbackT<any>): void;
    getrange(...args: any[]): Promise<any>;
    substr(args: any[], callback: ResCallbackT<any>): void;
    substr(...args: any[]): Promise<any>;
    incr(args: any[], callback: ResCallbackT<any>): void;
    incr(...args: any[]): Promise<any>;
    decr(args: any[], callback: ResCallbackT<any>): void;
    decr(...args: any[]): Promise<any>;
    mget(args: any[], callback: ResCallbackT<any>): void;
    mget(...args: any[]): Promise<any>;
    rpush(...args: any[]): Promise<any>;
    lpush(args: any[], callback: ResCallbackT<any>): void;
    lpush(...args: any[]): Promise<any>;
    rpushx(args: any[], callback: ResCallbackT<any>): void;
    rpushx(...args: any[]): Promise<any>;
    lpushx(args: any[], callback: ResCallbackT<any>): void;
    lpushx(...args: any[]): Promise<any>;
    linsert(args: any[], callback: ResCallbackT<any>): void;
    linsert(...args: any[]): Promise<any>;
    rpop(args: any[], callback: ResCallbackT<any>): void;
    rpop(...args: any[]): Promise<any>;
    lpop(args: any[], callback: ResCallbackT<any>): void;
    lpop(...args: any[]): Promise<any>;
    brpop(args: any[], callback: ResCallbackT<any>): void;
    brpop(...args: any[]): Promise<any>;
    brpoplpush(args: any[], callback: ResCallbackT<any>): void;
    brpoplpush(...args: any[]): Promise<any>;
    blpop(args: any[], callback: ResCallbackT<any>): void;
    blpop(...args: any[]): Promise<any>;
    llen(args: any[], callback: ResCallbackT<any>): void;
    llen(...args: any[]): Promise<any>;
    lindex(args: any[], callback: ResCallbackT<any>): void;
    lindex(...args: any[]): Promise<any>;
    lset(args: any[], callback: ResCallbackT<any>): void;
    lset(...args: any[]): Promise<any>;
    lrange(args: any[], callback: ResCallbackT<any>): void;
    lrange(...args: any[]): Promise<any>;
    ltrim(args: any[], callback: ResCallbackT<any>): void;
    ltrim(...args: any[]): Promise<any>;
    lrem(args: any[], callback: ResCallbackT<any>): void;
    lrem(...args: any[]): Promise<any>;
    rpoplpush(args: any[], callback: ResCallbackT<any>): void;
    rpoplpush(...args: any[]): Promise<any>;
    sadd(args: any[], callback: ResCallbackT<any>): void;
    sadd(...args: any[]): Promise<any>;
    srem(args: any[], callback: ResCallbackT<any>): void;
    srem(...args: any[]): Promise<any>;
    smove(args: any[], callback: ResCallbackT<any>): void;
    smove(...args: any[]): Promise<any>;
    sismember(args: any[], callback: ResCallbackT<any>): void;
    sismember(...args: any[]): Promise<any>;
    scard(args: any[], callback: ResCallbackT<any>): void;
    scard(...args: any[]): Promise<any>;
    spop(args: any[], callback: ResCallbackT<any>): void;
    spop(...args: any[]): Promise<any>;
    srandmember(args: any[], callback: ResCallbackT<any>): void;
    srandmember(...args: any[]): Promise<any>;
    sinter(args: any[], callback: ResCallbackT<any>): void;
    sinter(...args: any[]): Promise<any>;
    sinterstore(args: any[], callback: ResCallbackT<any>): void;
    sinterstore(...args: any[]): Promise<any>;
    sunion(args: any[], callback: ResCallbackT<any>): void;
    sunion(...args: any[]): Promise<any>;
    sunionstore(args: any[], callback: ResCallbackT<any>): void;
    sunionstore(...args: any[]): Promise<any>;
    sdiff(args: any[], callback: ResCallbackT<any>): void;
    sdiff(...args: any[]): Promise<any>;
    sdiffstore(args: any[], callback: ResCallbackT<any>): void;
    sdiffstore(...args: any[]): Promise<any>;
    smembers(args: any[], callback: ResCallbackT<any>): void;
    smembers(...args: any[]): Promise<any>;
    zadd(args: any[], callback: ResCallbackT<any>): void;
    zadd(...args: any[]): Promise<any>;
    zincrby(args: any[], callback: ResCallbackT<any>): void;
    zincrby(...args: any[]): Promise<any>;
    zrem(args: any[], callback: ResCallbackT<any>): void;
    zrem(...args: any[]): Promise<any>;
    zremrangebyscore(args: any[], callback: ResCallbackT<any>): void;
    zremrangebyscore(...args: any[]): Promise<any>;
    zremrangebyrank(args: any[], callback: ResCallbackT<any>): void;
    zremrangebyrank(...args: any[]): Promise<any>;
    zunionstore(args: any[], callback: ResCallbackT<any>): void;
    zunionstore(...args: any[]): Promise<any>;
    zinterstore(args: any[], callback: ResCallbackT<any>): void;
    zinterstore(...args: any[]): Promise<any>;
    zrange(args: any[], callback: ResCallbackT<any>): void;
    zrange(...args: any[]): Promise<any>;
    zrangebyscore(args: any[], callback: ResCallbackT<any>): void;
    zrangebyscore(...args: any[]): Promise<any>;
    zrevrangebyscore(args: any[], callback: ResCallbackT<any>): void;
    zrevrangebyscore(...args: any[]): Promise<any>;
    zcount(args: any[], callback: ResCallbackT<any>): void;
    zcount(...args: any[]): Promise<any>;
    zrevrange(args: any[], callback: ResCallbackT<any>): void;
    zrevrange(...args: any[]): Promise<any>;
    zcard(args: any[], callback: ResCallbackT<any>): void;
    zcard(...args: any[]): Promise<any>;
    zscore(args: any[], callback: ResCallbackT<any>): void;
    zscore(...args: any[]): Promise<any>;
    zrank(args: any[], callback: ResCallbackT<any>): void;
    zrank(...args: any[]): Promise<any>;
    zrevrank(args: any[], callback: ResCallbackT<any>): void;
    zrevrank(...args: any[]): Promise<any>;
    hset(args: any[], callback: ResCallbackT<any>): void;
    hset(...args: any[]): Promise<any>;
    hsetnx(args: any[], callback: ResCallbackT<any>): void;
    hsetnx(...args: any[]): Promise<any>;
    hget(args: any[], callback: ResCallbackT<any>): void;
    hget(...args: any[]): Promise<any>;
    hmset(args: any[], callback: ResCallbackT<any>): void;
    hmset(key: string, hash: any, callback: ResCallbackT<any>): void;
    hmset(...args: any[]): Promise<any>;
    hmget(args: any[], callback: ResCallbackT<any>): void;
    hmget(...args: any[]): Promise<any>;
    hincrby(args: any[], callback: ResCallbackT<any>): void;
    hincrby(...args: any[]): Promise<any>;
    hincrbyfloat(args: any[], callback: ResCallbackT<any>): void;
    hincrbyfloat(...args: any[]): Promise<any>;
    hdel(args: any[], callback: ResCallbackT<any>): void;
    hdel(...args: any[]): Promise<any>;
    hlen(args: any[], callback: ResCallbackT<any>): void;
    hlen(...args: any[]): Promise<any>;
    hkeys(args: any[], callback: ResCallbackT<any>): void;
    hkeys(...args: any[]): Promise<any>;
    hvals(args: any[], callback: ResCallbackT<any>): void;
    hvals(...args: any[]): Promise<any>;
    hgetall(args: any[], callback: ResCallbackT<any>): void;
    hgetall(...args: any[]): Promise<any>;
    hgetall(key: string, callback: ResCallbackT<any>): void;
    hexists(args: any[], callback: ResCallbackT<any>): void;
    hexists(...args: any[]): Promise<any>;
    incrby(args: any[], callback: ResCallbackT<any>): void;
    incrby(...args: any[]): Promise<any>;
    incrbyfloat(args: any[], callback: ResCallbackT<any>): void;
    incrbyfloat(...args: any[]): Promise<any>;
    decrby(args: any[], callback: ResCallbackT<any>): void;
    decrby(...args: any[]): Promise<any>;
    getset(args: any[], callback: ResCallbackT<any>): void;
    getset(...args: any[]): Promise<any>;
    mset(args: any[], callback: ResCallbackT<any>): void;
    mset(...args: any[]): Promise<any>;
    msetnx(args: any[], callback: ResCallbackT<any>): void;
    msetnx(...args: any[]): Promise<any>;
    randomkey(args: any[], callback: ResCallbackT<any>): void;
    randomkey(...args: any[]): Promise<any>;
    select(args: any[], callback: ResCallbackT<any>): void;
    select(...args: any[]): Promise<any>;
    move(args: any[], callback: ResCallbackT<any>): void;
    move(...args: any[]): Promise<any>;
    rename(args: any[], callback: ResCallbackT<any>): void;
    rename(...args: any[]): Promise<any>;
    renamenx(args: any[], callback: ResCallbackT<any>): void;
    renamenx(...args: any[]): Promise<any>;
    expire(args: any[], callback: ResCallbackT<any>): void;
    expire(...args: any[]): Promise<any>;
    pexpire(args: any[], callback: ResCallbackT<any>): void;
    pexpire(...args: any[]): Promise<any>;
    expireat(args: any[], callback: ResCallbackT<any>): void;
    expireat(...args: any[]): Promise<any>;
    pexpireat(args: any[], callback: ResCallbackT<any>): void;
    pexpireat(...args: any[]): Promise<any>;
    keys(args: any[], callback: ResCallbackT<any>): void;
    keys(...args: any[]): Promise<any>;
    dbsize(args: any[], callback: ResCallbackT<any>): void;
    dbsize(...args: any[]): Promise<any>;
    auth(args: any[], callback: ResCallbackT<any>): void;
    auth(...args: any[]): Promise<any>;
    ping(args: any[], callback: ResCallbackT<any>): void;
    ping(...args: any[]): Promise<any>;
    echo(args: any[], callback: ResCallbackT<any>): void;
    echo(...args: any[]): Promise<any>;
    save(args: any[], callback: ResCallbackT<any>): void;
    save(...args: any[]): Promise<any>;
    bgsave(args: any[], callback: ResCallbackT<any>): void;
    bgsave(...args: any[]): Promise<any>;
    bgrewriteaof(args: any[], callback: ResCallbackT<any>): void;
    bgrewriteaof(...args: any[]): Promise<any>;
    shutdown(args: any[], callback: ResCallbackT<any>): void;
    shutdown(...args: any[]): Promise<any>;
    lastsave(args: any[], callback: ResCallbackT<any>): void;
    lastsave(...args: any[]): Promise<any>;
    type(args: any[], callback: ResCallbackT<any>): void;
    type(...args: any[]): Promise<any>;
    multi(args: any[], callback: ResCallbackT<any>): void;
    multi(...args: any[]): Promise<any>;
    exec(args: any[], callback: ResCallbackT<any>): void;
    exec(...args: any[]): Promise<any>;
    discard(args: any[], callback: ResCallbackT<any>): void;
    discard(...args: any[]): Promise<any>;
    sync(args: any[], callback: ResCallbackT<any>): void;
    sync(...args: any[]): Promise<any>;
    flushdb(args: any[], callback: ResCallbackT<any>): void;
    flushdb(...args: any[]): Promise<any>;
    flushall(args: any[], callback: ResCallbackT<any>): void;
    flushall(...args: any[]): Promise<any>;
    sort(args: any[], callback: ResCallbackT<any>): void;
    sort(...args: any[]): Promise<any>;
    info(args: any[], callback: ResCallbackT<any>): void;
    info(...args: any[]): Promise<any>;
    time(args: any[], callback: ResCallbackT<any>): void;
    time(...args: any[]): Promise<any>;
    monitor(args: any[], callback: ResCallbackT<any>): void;
    monitor(...args: any[]): Promise<any>;
    ttl(args: any[], callback: ResCallbackT<any>): void;
    ttl(...args: any[]): Promise<any>;
    persist(args: any[], callback: ResCallbackT<any>): void;
    persist(...args: any[]): Promise<any>;
    slaveof(args: any[], callback: ResCallbackT<any>): void;
    slaveof(...args: any[]): Promise<any>;
    debug(args: any[], callback: ResCallbackT<any>): void;
    debug(...args: any[]): Promise<any>;
    config(args: any[], callback: ResCallbackT<any>): void;
    config(...args: any[]): Promise<any>;
    subscribe(args: any[], callback: ResCallbackT<any>): void;
    subscribe(...args: any[]): Promise<any>;
    unsubscribe(args: any[], callback: ResCallbackT<any>): void;
    unsubscribe(...args: any[]): Promise<any>;
    psubscribe(args: any[], callback: ResCallbackT<any>): void;
    psubscribe(...args: any[]): Promise<any>;
    punsubscribe(args: any[], callback: ResCallbackT<any>): void;
    punsubscribe(...args: any[]): Promise<any>;
    publish(args: any[], callback: ResCallbackT<any>): void;
    publish(...args: any[]): Promise<any>;
    watch(args: any[], callback: ResCallbackT<any>): void;
    watch(...args: any[]): Promise<any>;
    unwatch(args: any[], callback: ResCallbackT<any>): void;
    unwatch(...args: any[]): Promise<any>;
    cluster(args: any[], callback: ResCallbackT<any>): void;
    cluster(...args: any[]): Promise<any>;
    restore(args: any[], callback: ResCallbackT<any>): void;
    restore(...args: any[]): Promise<any>;
    migrate(args: any[], callback: ResCallbackT<any>): void;
    migrate(...args: any[]): Promise<any>;
    dump(args: any[], callback: ResCallbackT<any>): void;
    dump(...args: any[]): Promise<any>;
    object(args: any[], callback: ResCallbackT<any>): void;
    object(...args: any[]): Promise<any>;
    client(args: any[], callback: ResCallbackT<any>): void;
    client(...args: any[]): Promise<any>;
    eval(args: any[], callback: ResCallbackT<any>): void;
    eval(...args: any[]): Promise<any>;
    evalsha(args: any[], callback: ResCallbackT<any>): void;
    evalsha(...args: any[]): Promise<any>;
    script(args: any[], callback: ResCallbackT<any>): void;
    script(...args: any[]): Promise<any>;
    script(key: string, callback: ResCallbackT<any>): void;
    quit(...args: any[]): Promise<any>;
    quit(args: any[], callback: ResCallbackT<any>): void;
    scan(...args: any[]): Promise<any>;
    scan(args: any[], callback: ResCallbackT<any>): void;
    hscan(...args: any[]): Promise<any>;
    hscan(args: any[], callback: ResCallbackT<any>): void;
    zscan(...args: any[]): Promise<any>;
    zscan(args: any[], callback: ResCallbackT<any>): void;

    pipeline(): Pipeline;
    pipeline(commands: string[][]): Pipeline;

    scanStream(options?: ScanStreamOption): events$EventEmitter;
    hscanStream(key: string, options?: ScanStreamOption): events$EventEmitter;
    zscanStream(key: string, options?: ScanStreamOption): events$EventEmitter;
  }

  declare type Pipeline = {
    exec(callback?: ResCallbackT<any[]>): any,

    get(args: any[], callback?: ResCallbackT<string>): Pipeline,
    get(...args: any[]): Pipeline,
    set(args: any[], callback?: ResCallbackT<string>): Pipeline,
    set(...args: any[]): Pipeline,
    setnx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    setnx(...args: any[]): Pipeline,
    setex(args: any[], callback?: ResCallbackT<any>): Pipeline,
    setex(...args: any[]): Pipeline,
    psetex(args: any[], callback?: ResCallbackT<any>): Pipeline,
    psetex(...args: any[]): Pipeline,
    append(args: any[], callback?: ResCallbackT<any>): Pipeline,
    append(...args: any[]): Pipeline,
    strlen(args: any[], callback?: ResCallbackT<any>): Pipeline,
    strlen(...args: any[]): Pipeline,
    del(args: any[], callback?: ResCallbackT<any>): Pipeline,
    del(...args: any[]): Pipeline,
    exists(args: any[], callback?: ResCallbackT<any>): Pipeline,
    exists(...args: any[]): Pipeline,
    setbit(args: any[], callback?: ResCallbackT<any>): Pipeline,
    setbit(...args: any[]): Pipeline,
    getbit(args: any[], callback?: ResCallbackT<any>): Pipeline,
    getbit(...args: any[]): Pipeline,
    setrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    setrange(...args: any[]): Pipeline,
    getrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    getrange(...args: any[]): Pipeline,
    substr(args: any[], callback?: ResCallbackT<any>): Pipeline,
    substr(...args: any[]): Pipeline,
    incr(args: any[], callback?: ResCallbackT<any>): Pipeline,
    incr(...args: any[]): Pipeline,
    decr(args: any[], callback?: ResCallbackT<any>): Pipeline,
    decr(...args: any[]): Pipeline,
    mget(args: any[], callback?: ResCallbackT<any>): Pipeline,
    mget(...args: any[]): Pipeline,
    rpush(...args: any[]): Pipeline,
    lpush(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lpush(...args: any[]): Pipeline,
    rpushx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    rpushx(...args: any[]): Pipeline,
    lpushx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lpushx(...args: any[]): Pipeline,
    linsert(args: any[], callback?: ResCallbackT<any>): Pipeline,
    linsert(...args: any[]): Pipeline,
    rpop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    rpop(...args: any[]): Pipeline,
    lpop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lpop(...args: any[]): Pipeline,
    brpop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    brpop(...args: any[]): Pipeline,
    brpoplpush(args: any[], callback?: ResCallbackT<any>): Pipeline,
    brpoplpush(...args: any[]): Pipeline,
    blpop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    blpop(...args: any[]): Pipeline,
    llen(args: any[], callback?: ResCallbackT<any>): Pipeline,
    llen(...args: any[]): Pipeline,
    lindex(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lindex(...args: any[]): Pipeline,
    lset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lset(...args: any[]): Pipeline,
    lrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lrange(...args: any[]): Pipeline,
    ltrim(args: any[], callback?: ResCallbackT<any>): Pipeline,
    ltrim(...args: any[]): Pipeline,
    lrem(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lrem(...args: any[]): Pipeline,
    rpoplpush(args: any[], callback?: ResCallbackT<any>): Pipeline,
    rpoplpush(...args: any[]): Pipeline,
    sadd(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sadd(...args: any[]): Pipeline,
    srem(args: any[], callback?: ResCallbackT<any>): Pipeline,
    srem(...args: any[]): Pipeline,
    smove(args: any[], callback?: ResCallbackT<any>): Pipeline,
    smove(...args: any[]): Pipeline,
    sismember(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sismember(...args: any[]): Pipeline,
    scard(args: any[], callback?: ResCallbackT<any>): Pipeline,
    scard(...args: any[]): Pipeline,
    spop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    spop(...args: any[]): Pipeline,
    srandmember(args: any[], callback?: ResCallbackT<any>): Pipeline,
    srandmember(...args: any[]): Pipeline,
    sinter(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sinter(...args: any[]): Pipeline,
    sinterstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sinterstore(...args: any[]): Pipeline,
    sunion(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sunion(...args: any[]): Pipeline,
    sunionstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sunionstore(...args: any[]): Pipeline,
    sdiff(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sdiff(...args: any[]): Pipeline,
    sdiffstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sdiffstore(...args: any[]): Pipeline,
    smembers(args: any[], callback?: ResCallbackT<any>): Pipeline,
    smembers(...args: any[]): Pipeline,
    zadd(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zadd(...args: any[]): Pipeline,
    zincrby(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zincrby(...args: any[]): Pipeline,
    zrem(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrem(...args: any[]): Pipeline,
    zremrangebyscore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zremrangebyscore(...args: any[]): Pipeline,
    zremrangebyrank(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zremrangebyrank(...args: any[]): Pipeline,
    zunionstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zunionstore(...args: any[]): Pipeline,
    zinterstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zinterstore(...args: any[]): Pipeline,
    zrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrange(...args: any[]): Pipeline,
    zrangebyscore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrangebyscore(...args: any[]): Pipeline,
    zrevrangebyscore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrevrangebyscore(...args: any[]): Pipeline,
    zcount(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zcount(...args: any[]): Pipeline,
    zrevrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrevrange(...args: any[]): Pipeline,
    zcard(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zcard(...args: any[]): Pipeline,
    zscore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zscore(...args: any[]): Pipeline,
    zrank(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrank(...args: any[]): Pipeline,
    zrevrank(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrevrank(...args: any[]): Pipeline,
    hset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hset(...args: any[]): Pipeline,
    hsetnx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hsetnx(...args: any[]): Pipeline,
    hget(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hget(...args: any[]): Pipeline,
    hmset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hmset(key: string, hash: any, callback?: ResCallbackT<any>): Pipeline,
    hmset(...args: any[]): Pipeline,
    hmget(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hmget(...args: any[]): Pipeline,
    hincrby(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hincrby(...args: any[]): Pipeline,
    hincrbyfloat(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hincrbyfloat(...args: any[]): Pipeline,
    hdel(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hdel(...args: any[]): Pipeline,
    hlen(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hlen(...args: any[]): Pipeline,
    hkeys(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hkeys(...args: any[]): Pipeline,
    hvals(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hvals(...args: any[]): Pipeline,
    hgetall(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hgetall(...args: any[]): Pipeline,
    hgetall(key: string, callback?: ResCallbackT<any>): Pipeline,
    hexists(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hexists(...args: any[]): Pipeline,
    incrby(args: any[], callback?: ResCallbackT<any>): Pipeline,
    incrby(...args: any[]): Pipeline,
    incrbyfloat(args: any[], callback?: ResCallbackT<any>): Pipeline,
    incrbyfloat(...args: any[]): Pipeline,
    decrby(args: any[], callback?: ResCallbackT<any>): Pipeline,
    decrby(...args: any[]): Pipeline,
    getset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    getset(...args: any[]): Pipeline,
    mset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    mset(...args: any[]): Pipeline,
    msetnx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    msetnx(...args: any[]): Pipeline,
    randomkey(args: any[], callback?: ResCallbackT<any>): Pipeline,
    randomkey(...args: any[]): Pipeline,
    select(args: any[], callback?: ResCallbackT<any>): void,
    select(...args: any[]): Pipeline,
    move(args: any[], callback?: ResCallbackT<any>): Pipeline,
    move(...args: any[]): Pipeline,
    rename(args: any[], callback?: ResCallbackT<any>): Pipeline,
    rename(...args: any[]): Pipeline,
    renamenx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    renamenx(...args: any[]): Pipeline,
    expire(args: any[], callback?: ResCallbackT<any>): Pipeline,
    expire(...args: any[]): Pipeline,
    pexpire(args: any[], callback?: ResCallbackT<any>): Pipeline,
    pexpire(...args: any[]): Pipeline,
    expireat(args: any[], callback?: ResCallbackT<any>): Pipeline,
    expireat(...args: any[]): Pipeline,
    pexpireat(args: any[], callback?: ResCallbackT<any>): Pipeline,
    pexpireat(...args: any[]): Pipeline,
    keys(args: any[], callback?: ResCallbackT<any>): Pipeline,
    keys(...args: any[]): Pipeline,
    dbsize(args: any[], callback?: ResCallbackT<any>): Pipeline,
    dbsize(...args: any[]): Pipeline,
    auth(args: any[], callback?: ResCallbackT<any>): void,
    auth(...args: any[]): void,
    ping(args: any[], callback?: ResCallbackT<any>): Pipeline,
    ping(...args: any[]): Pipeline,
    echo(args: any[], callback?: ResCallbackT<any>): Pipeline,
    echo(...args: any[]): Pipeline,
    save(args: any[], callback?: ResCallbackT<any>): Pipeline,
    save(...args: any[]): Pipeline,
    bgsave(args: any[], callback?: ResCallbackT<any>): Pipeline,
    bgsave(...args: any[]): Pipeline,
    bgrewriteaof(args: any[], callback?: ResCallbackT<any>): Pipeline,
    bgrewriteaof(...args: any[]): Pipeline,
    shutdown(args: any[], callback?: ResCallbackT<any>): Pipeline,
    shutdown(...args: any[]): Pipeline,
    lastsave(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lastsave(...args: any[]): Pipeline,
    type(args: any[], callback?: ResCallbackT<any>): Pipeline,
    type(...args: any[]): Pipeline,
    multi(args: any[], callback?: ResCallbackT<any>): Pipeline,
    multi(...args: any[]): Pipeline,
    exec(args: any[], callback?: ResCallbackT<any>): Pipeline,
    exec(...args: any[]): Pipeline,
    discard(args: any[], callback?: ResCallbackT<any>): Pipeline,
    discard(...args: any[]): Pipeline,
    sync(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sync(...args: any[]): Pipeline,
    flushdb(args: any[], callback?: ResCallbackT<any>): Pipeline,
    flushdb(...args: any[]): Pipeline,
    flushall(args: any[], callback?: ResCallbackT<any>): Pipeline,
    flushall(...args: any[]): Pipeline,
    sort(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sort(...args: any[]): Pipeline,
    info(args: any[], callback?: ResCallbackT<any>): Pipeline,
    info(...args: any[]): Pipeline,
    time(args: any[], callback?: ResCallbackT<any>): Pipeline,
    time(...args: any[]): Pipeline,
    monitor(args: any[], callback?: ResCallbackT<any>): Pipeline,
    monitor(...args: any[]): Pipeline,
    ttl(args: any[], callback?: ResCallbackT<any>): Pipeline,
    ttl(...args: any[]): Pipeline,
    persist(args: any[], callback?: ResCallbackT<any>): Pipeline,
    persist(...args: any[]): Pipeline,
    slaveof(args: any[], callback?: ResCallbackT<any>): Pipeline,
    slaveof(...args: any[]): Pipeline,
    debug(args: any[], callback?: ResCallbackT<any>): Pipeline,
    debug(...args: any[]): Pipeline,
    config(args: any[], callback?: ResCallbackT<any>): Pipeline,
    config(...args: any[]): Pipeline,
    subscribe(args: any[], callback?: ResCallbackT<any>): Pipeline,
    subscribe(...args: any[]): Pipeline,
    unsubscribe(args: any[], callback?: ResCallbackT<any>): Pipeline,
    unsubscribe(...args: any[]): Pipeline,
    psubscribe(args: any[], callback?: ResCallbackT<any>): Pipeline,
    psubscribe(...args: any[]): Pipeline,
    punsubscribe(args: any[], callback?: ResCallbackT<any>): Pipeline,
    punsubscribe(...args: any[]): Pipeline,
    publish(args: any[], callback?: ResCallbackT<any>): Pipeline,
    publish(...args: any[]): Pipeline,
    watch(args: any[], callback?: ResCallbackT<any>): Pipeline,
    watch(...args: any[]): Pipeline,
    unwatch(args: any[], callback?: ResCallbackT<any>): Pipeline,
    unwatch(...args: any[]): Pipeline,
    cluster(args: any[], callback?: ResCallbackT<any>): Pipeline,
    cluster(...args: any[]): Pipeline,
    restore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    restore(...args: any[]): Pipeline,
    migrate(args: any[], callback?: ResCallbackT<any>): Pipeline,
    migrate(...args: any[]): Pipeline,
    dump(args: any[], callback?: ResCallbackT<any>): Pipeline,
    dump(...args: any[]): Pipeline,
    object(args: any[], callback?: ResCallbackT<any>): Pipeline,
    object(...args: any[]): Pipeline,
    client(args: any[], callback?: ResCallbackT<any>): Pipeline,
    client(...args: any[]): Pipeline,
    eval(args: any[], callback?: ResCallbackT<any>): Pipeline,
    eval(...args: any[]): Pipeline,
    evalsha(args: any[], callback?: ResCallbackT<any>): Pipeline,
    evalsha(...args: any[]): Pipeline,
    quit(args: any[], callback?: ResCallbackT<any>): Pipeline,
    quit(...args: any[]): Pipeline,
    scan(...args: any[]): Pipeline,
    scan(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hscan(...args: any[]): Pipeline,
    hscan(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zscan(...args: any[]): Pipeline,
    zscan(args: any[], callback?: ResCallbackT<any>): Pipeline
  };

  declare class Cluster extends Redis {
    constructor(
      nodes: { host: string, port: number }[],
      options?: ClusterOptions
    ): void;
    nodes(role: string): Redis[];
  }

  declare type ResCallbackT<R> = (err: Error, res: R) => void;

  declare type RedisOptions = {
    port?: number,
    host?: string,
    /**
     * 4 (IPv4) or 6 (IPv6), Defaults to 4.
     */
    family?: number,
    /**
     * Local domain socket path. If set the port, host and family will be ignored.
     */
    path?: string,
    /**
     * TCP KeepAlive on the socket with a X ms delay before start. Set to a non-number value to disable keepAlive.
     */
    keepAlive?: number,
    connectionName?: string,
    /**
     * If set, client will send AUTH command with the value of this option when connected.
     */
    password?: string,
    /**
     * Database index to use.
     */
    db?: number,
    /**
     * When a connection is established to the Redis server, the server might still be loading
     * the database from disk. While loading, the server not respond to any commands.
     * To work around this, when this option is true, ioredis will check the status of the Redis server,
     * and when the Redis server is able to process commands, a ready event will be emitted.
     */
    enableReadyCheck?: boolean,
    keyPrefix?: string,
    /**
     * When the return value isn't a number, ioredis will stop trying to reconnect.
     * Fixed in: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/15858
     */
    retryStrategy?: (times: number) => number | false,
    reconnectOnError?: (error: Error) => boolean,
    /**
     * By default, if there is no active connection to the Redis server, commands are added to a queue
     * and are executed once the connection is "ready" (when enableReadyCheck is true, "ready" means
     * the Redis server has loaded the database from disk, otherwise means the connection to the Redis
     * server has been established). If this option is false, when execute the command when the connection
     * isn't ready, an error will be returned.
     */
    enableOfflineQueue?: boolean,
    /**
     * The milliseconds before a timeout occurs during the initial connection to the Redis server.
     * default: 10000.
     */
    connectTimeout?: number,
    /**
     * After reconnected, if the previous connection was in the subscriber mode, client will auto re-subscribe these channels.
     * default: true.
     */
    autoResubscribe?: boolean,
    /**
     * If true, client will resend unfulfilled commands(e.g. block commands) in the previous connection when reconnected.
     * default: true.
     */
    autoResendUnfulfilledCommands?: boolean,
    lazyConnect?: boolean,
    tls?: {
      ca: Buffer
    },
    sentinels?: { host: string, port: number }[],
    name?: string,
    /**
     * Enable READONLY mode for the connection. Only available for cluster mode.
     * default: false.
     */
    readOnly?: boolean,
    /**
     * If you are using the hiredis parser, it's highly recommended to enable this option.
     * Create another instance with dropBufferSupport disabled for other commands that you want to return binary instead of string:
     */
    dropBufferSupport?: boolean
  };

  declare type ScanStreamOption = {
    match?: string,
    count?: number
  };

  declare type ClusterNodeType = "all" | "slave" | "master";

  declare type ClusterOptions = {
    clusterRetryStrategy?: (times: number) => number,
    enableOfflineQueue?: boolean,
    enableReadyCheck?: boolean,
    scaleReads?: ClusterNodeType,
    maxRedirections?: number,
    retryDelayOnFailover?: number,
    retryDelayOnClusterDown?: number,
    retryDelayOnTryAgain?: number,
    redisOptions?: RedisOptions
  };

  declare class RedisStatic extends Redis {
    static Cluster: Class<Cluster>;
    static Commander: Class<Commander>;
  }

  declare module.exports: typeof RedisStatic;
}
