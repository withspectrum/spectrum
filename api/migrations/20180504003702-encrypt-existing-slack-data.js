const { encryptString } = require('../../shared/encryption');

exports.up = async (r, conn) => {
  const encryptOldSlackImportData = async () => {
    const records = await r
      .table('slackImports')
      .run(conn)
      .then(cursor => cursor.toArray());

    const recordPromises = records.map(async record => {
      const teamId = encryptString(record.teamId);
      const teamName = encryptString(record.teamName);
      const token = encryptString(record.token);

      return await r
        .table('slackImports')
        .get(record.id)
        .update({
          teamId,
          teamName,
          token,
        })
        .run(conn);
    });

    return await Promise.all([...recordPromises]);
  };

  const encryptNewSlackImportData = async () => {
    const records = await r
      .table('communitySettings')
      .filter(row => row.hasFields('slackSettings'))
      .run(conn)
      .then(cursor => cursor.toArray());

    const recordPromises = records.map(async record => {
      const teamId = encryptString(record.slackSettings.teamId);
      const teamName = encryptString(record.slackSettings.teamName);
      const token = encryptString(record.slackSettings.token);
      const scope = encryptString(record.slackSettings.scope);

      return await r
        .table('communitySettings')
        .get(record.id)
        .update({
          slackSettings: {
            teamId,
            teamName,
            token,
            scope,
          },
        })
        .run(conn);
    });

    return await Promise.all([...recordPromises]);
  };

  return await Promise.all([
    encryptOldSlackImportData(),
    encryptNewSlackImportData(),
  ]).catch(err => console.error(err));
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
