export const sortThreadsByLatestActivity = (
  threads: Array<Object>
): Array<Object> => {
  // copy the array of threads
  const unsortedThreads = threads.slice(0);

  // for each thread
  const sortedThreads = unsortedThreads.sort((x, y));

  return sortedThreads;
};
