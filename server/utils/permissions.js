const isAdmin = (id: string) => {
  const admins = [
    'ce2b4488-4c75-47e0-8ebc-2539c1e6a190',
    'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
    'uItS3QQiUxXH44m14uWmixTbqSc2',
  ];
  return admins.indexOf(id) > -1;
};

module.exports = {
  isAdmin,
};
