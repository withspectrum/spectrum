exports.up = function(r, conn) {
  return r
    .table('users')
    .insert({
      id: 'sam',
      description: "Spectrum's automated bot.",
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
      name: 'Spectrum Bot',
      termsLastAcceptedAt: new Date(),
      username: 'spectrumbot',
      website: 'https://spectrum.chat',
      profilePhoto: '/default_images/sam.png',
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
