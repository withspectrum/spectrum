const cursorToArray = cursor =>
  new Promise(resolve => {
    cursor.toArray((err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });

module.exports = {
  cursorToArray,
};
