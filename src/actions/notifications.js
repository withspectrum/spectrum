// @flow
export const updateNotificationsCount = (countType: string, count: number) => ({
  type: 'UPDATE_NOTIFICATIONS_BADGE_COUNT',
  countType,
  count,
});
