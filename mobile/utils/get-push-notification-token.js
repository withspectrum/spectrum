// @flow
// Taken from https://docs.expo.io/versions/latest/guides/push-notifications.html#1-save-the-users-expo-push-token-on-your-server
import { Permissions, Notifications } from 'expo';

async function getPushNotificationToken(): Promise<string | boolean> {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return false;
  }

  // Get the token that uniquely identifies this device
  return await Notifications.getExpoPushTokenAsync();
}

export default getPushNotificationToken;
