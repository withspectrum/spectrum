exports.up = function(r, conn) {
  return Promise.all([
    r
      .tableCreate('curatedContent')
      .run(conn)
      .then(() => {
        const types = [
          {
            type: 'design-communities',
            data: [
              'product-design',
              'icon-design',
              'typography',
              'illustrators',
              'design-management',
              'specfm',
              'up-coming',
              'sketchcasts',
              'google-design',
              'design-code',
              'vectors',
              'designhunt',
              'figma',
              'sketch',
              'framer',
              'abstract',
              'invision',
              'principle',
              'compositor',
              'origami-studio',
              'webflow',
              'fuse',
            ],
          },
          {
            type: 'development-communities',
            data: [
              'realm',
              'expo',
              'compositor',
              'codepen',
              'bootstrap',
              'tachyons',
              'frontend',
              'specfm',
              'android',
              'swiftdev',
              'react-native',
              'react',
              'node',
              'vue-js',
              'angular',
              'ember-js',
              'laravel',
              'elixir',
              'styled-components',
              'graphql',
              'css-in-js',
              'electron',
            ],
          },
          {
            type: 'tech-communities',
            data: [
              'tech-tea',
              'balancemymoney',
              'crypto',
              'btc',
              'ethereum',
              'augmented-reality',
              'voice-interfaces',
            ],
          },
          {
            type: 'life-communities',
            data: [
              'for-good',
              'mental-health',
              'dev-fit',
              'music',
              'tabletop-rpg',
              'gaming',
              'careers',
              'job-opportunities',
              'need-some-work',
            ],
          },
          {
            type: 'top-communities-by-members',
            data: [
              'spectrum',
              'sketch',
              'react',
              'specfm',
              'product-design',
              'figma',
              'styled-components',
              'framer',
              'frontend',
              'google-design',
              'wip',
              'abstract',
              'vectors',
              'crypto',
              'sketchcasts',
              'bootstrap',
              'css-in-js',
              'ooohours',
              'tech-tea',
              'design-code',
            ],
          },
        ];

        const insertPromises = types.map(type => {
          return r
            .table('curatedContent')
            .insert(type)
            .run(conn);
        });

        return Promise.all([insertPromises]);
      })
      .catch(err => {
        console.log(err);
        throw err;
      }),
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('curatedContent').run(conn)]);
};
