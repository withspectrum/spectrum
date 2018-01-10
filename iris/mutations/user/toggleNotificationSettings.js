// @flow

export default (
  _: any,
  { input }: { input: ToggleNotificationsArguments },
  { user }: { user: DBUser }
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this profile.'
    );
  }

  return (
    getUsersSettings(currentUser.id)
      // destructure the notifications so we don't pass the id into the model downstream
      // trying to update a primary key 'id' will throw a reql error
      .then(({ id, ...settings }) => {
        let newSettings = Object.assign({}, settings, {
          ...settings,
        });
        let oldVal =
          settings.notifications.types[input.notificationType][
            input.deliveryMethod
          ];
        newSettings['notifications']['types'][input.notificationType][
          input.deliveryMethod
        ] = !oldVal;

        return updateUsersNotificationSettings(currentUser.id, newSettings);
      })
      .then(() => getUsers([currentUser.id]).then(users => users[0]))
  );
};
