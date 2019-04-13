exports.up = function(r, conn) {
  return Promise.all([
    r
      .table('usersCommunities')
      .indexCreate('communityIdAndIsMember', [
        r.row('communityId'),
        r.row('isMember'),
      ])
      .run(conn),
    r
      .table('usersCommunities')
      .indexCreate('communityIdAndIsMemberAndReputation', [
        r.row('communityId'),
        r.row('isMember'),
        r.row('reputation'),
      ])
      .run(conn),
    r
      .table('usersCommunities')
      .indexCreate('communityIdAndIsModerator', [
        r.row('communityId'),
        r.row('isModerator'),
      ])
      .run(conn),
    r
      .table('usersCommunities')
      .indexCreate('communityIdAndIsOwner', [
        r.row('communityId'),
        r.row('isOwner'),
      ])
      .run(conn),
    r
      .table('usersCommunities')
      .indexCreate('communityIdAndIsTeamMember', [
        r.row('communityId'),
        r.row('isOwner').or(r.row('isModerator')),
      ])
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('usersCommunities')
      .indexDrop('communityIdAndIsMember')
      .run(conn),
    r
      .table('usersCommunities')
      .indexDrop('communityIdAndIsModerator')
      .run(conn),
    r
      .table('usersCommunities')
      .indexDrop('communityIdAndIsOwner')
      .run(conn),
    r
      .table('usersCommunities')
      .indexDrop('communityIdAndIsTeamMember')
      .run(conn),
  ]);
};
