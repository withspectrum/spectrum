// @flow

export const READ_RUN_ERROR = `Do not call .run() on the query passed to createReadQuery!

Bad: db.table('users').get(userId).run()
Good: db.table('users').get(userId)

If you need to post-process the query data (.run().then()), use the \`process\` hook.
`;

export const WRITE_RUN_ERROR = `Don't forget to call .run() on the query passed to createWriteQuery!

Bad: db.table('users').get(userId)
Good: db.table('users').get(userId).run()

If you need to post-process the result, simply use .then()! \`.run().then(result => /* ... */)!\`
`;
