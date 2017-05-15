//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';

import Icon from '../../../components/icons';
import { Col, Row, RowLabel } from '../style';

const ProfileMenuPure = props => {
  const { user } = props;
  return (
    <Col>
      <Link to={`/user/${user.uid}`}>
        <Row>
          <Icon glyph="profile" />
          <RowLabel>My Profile</RowLabel>
        </Row>
      </Link>
      <Link to={`/user/${user.uid}/settings`}>
        <Row>
          <Icon glyph="settings" />
          <RowLabel>Settings</RowLabel>
        </Row>
      </Link>
    </Col>
  );
};

const ProfileMenu = compose(pure)(ProfileMenuPure);

export default ProfileMenu;
