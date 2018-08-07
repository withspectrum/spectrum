const FRECENCY_WEIGHTS = {
  messageWeight: 1,
  reactionWeight: 0.2,
  ageWeight: 0.25,
  lastActiveWeight: 0.5,
};

exports.up = function(r, conn) {
  return r
    .table('threads')
    .indexCreate('frecency_score', thread => {
      return thread('messageCount')
        .default(0)
        .mul(FRECENCY_WEIGHTS.messageWeight)
        .add(
          thread('reactionCount')
            .default(0)
            .mul(FRECENCY_WEIGHTS.reactionWeight)
        )
        .sub(
          r
            .round(
              r
                .now()
                .sub(thread('createdAt'))
                .div(86400)
            )
            .mul(FRECENCY_WEIGHTS.ageWeight)
        )
        .sub(
          r
            .round(
              r
                .now()
                .sub(thread('lastActive').default(thread('createdAt')))
                .div(86400)
            )
            .mul(FRECENCY_WEIGHTS.lastActiveWeight)
        );
    })
    .run(conn);
};

exports.down = function(r, conn) {
  return r
    .table('threads')
    .indexDrop('frecency_score')
    .run(conn);
};
