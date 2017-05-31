// @flow

export const sortThreadsByLatestActivity = (
  threads: Array<Object>
): Array<Object> => {
  // copy the array of threads
  const unsortedThreads = threads.slice(0);

  // for each thread
  const sortedThreads = unsortedThreads.sort((x, y) => {
    const xParticipantsSortedByActivity = x.participants.sort((a, b) => {
      const aTimestamp = new Date(a.lastActive).getTime();
      const bTimestamp = new Date(b.lastActive).getTime();
      return aTimestamp - bTimestamp;
    });

    const yParticipantsSortedByActivity = y.participants.sort((a, b) => {
      const aTimestamp = new Date(a.lastActive).getTime();
      const bTimestamp = new Date(b.lastActive).getTime();
      return aTimestamp - bTimestamp;
    });

    return;
  });

  return sortedThreads;
};
