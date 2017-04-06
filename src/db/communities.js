import database from 'firebase/database';

const getCommunityById = id => {
  const db = database();

  return db
    .ref(`communities/${id}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

const getCommunityBySlug = slug => {
  const db = database();

  return db
    .ref(`communities`)
    .orderByChild('slug')
    .equalTo(slug)
    .once('value')
    .then(snapshot => {
      const results = snapshot.val();
      return results[Object.keys(results)[0]];
    });
};

export const getCommunity = ({ id, slug }) => {
  console.log('here ', id, slug);
  if (id) return getCommunityById(id);
  if (slug) return getCommunityBySlug(slug);

  throw new Error('Please pass either a slug or an id to getCommunity()!');
};
