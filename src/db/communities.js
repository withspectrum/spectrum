import database from 'firebase/database';

export const getCommunity = ({ id }) => {
  const db = database();

  return db
    .ref(`communities/${id}`)
    .once('value')
    .then(snapshot => snapshot.val());
};
