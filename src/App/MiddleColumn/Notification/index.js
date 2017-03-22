import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import deepEqual from 'deep-eql';
import Icon from '../../../shared/Icons';
import { timeDifference } from '../../../helpers/utils';
import { Heading, Subheading, CardHeader, Title, B } from './style';
import Card from '../../../shared/Card';
import { FlexCol, P } from '../../../shared/Globals';

class Notification extends Component {
  shouldComponentUpdate(nextProps) {
    return !deepEqual(nextProps, this.props);
  }

  render() {
    const { link, person, title, messages, isRead, isActive } = this.props;
    return (
      <Card link={link} selected={isActive}>
        <FlexCol>
          <CardHeader padding={'8px'}>
            <Icon
              icon="send"
              static
              color={isRead ? 'text.placeholder' : 'success.default'}
            />
            <FlexCol padding={'0 0 0 8px'}>
              <Heading>{person.name}</Heading>
              <Title>{title}</Title>
              <Subheading>
                {messages > 1 ? `${messages} new messages` : `1 message`}
              </Subheading>
            </FlexCol>
          </CardHeader>
        </FlexCol>
      </Card>
    );
  }
}

Notification.propTypes = {
  link: React.PropTypes.string.isRequired,
  person: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
  messages: React.PropTypes.number.isRequired,
};

export default Notification;
