const r = require('rethinkdbdash')();
const type = require('type-detect');

const REF_TABLE_MAP = {
  creators: 'users',
  authors: 'users',
  senders: 'users',
  communitys: 'communities',
  watercoolers: 'threads',
  parents: 'messages',
};

(async () => {
  const tables = await r
    .db('rethinkdb')
    .table('table_config')
    .filter({
      db: 'spectrum',
    })
    .map(rec => rec('name'))
    .run();

  for (const table of tables) {
    const [record] = await r
      .db('spectrum')
      .table(table)
      .limit(1)
      .run();

    if (!record) {
      // console.warn(`could not find record in table ${table}`);
    } else {
      let output = `Table ${table} {`;
      Object.keys(record).forEach(key => {
        let keyType =
          key === 'id' || key.endsWith('Id')
            ? 'uuid'
            : key.endsWith('At')
            ? 'Date'
            : type(record[key]);
        output += `\n  ${key} ${keyType}`;
        if (key.endsWith('Id')) {
          let refTable = key.replace(/id$/i, '').toLowerCase() + 's';
          refTable = REF_TABLE_MAP[refTable] || refTable;
          if (tables.includes(refTable)) {
            output += ` [ref: < ${refTable}.id]`;
          }
        }
      });
      output += `\n}\n`;
      console.log(output);
    }
  }
})()
  .then(() => {
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
