exports.up = function(r, conn) {
  return r
    .table('users')
    .insert({
      id: 'sam',
      description:
        "Spectrum Automated Moderator (SAM) is Spectrum's built-in bot.",
      createdAt: new Date(),
      email: null,
      providerId: null,
      fbProviderId: null,
      githubProviderId: null,
      githubUsername: 'withspectrum',
      googleProviderId: null,
      isOnline: true,
      lastSeen: new Date(),
      modifiedAt: new Date(),
      name: 'Sam',
      termsLastAcceptedAt: new Date(),
      username: 'spectrumbot',
      website: 'https://spectrum.chat',
    })
    .run(conn);
};
exports.down = function(r, conn) {
  return r
    .table('users')
    .get('sam')
    .delete()
    .run(conn);
};
