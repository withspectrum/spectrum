// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icons';
import { Row, Content, Label, Description, Actions } from './style';

type Props = {
  channelObject: Object,
  id: string,
  name?: string,
  description?: ?string,
  children?: React.Node,
};

export const ChannelListItem = (props: Props) => {
  const { channelObject, name, description, children } = props;

  return (
    <Link to={`/${channelObject.community.slug}/${channelObject.slug}`}>
      <Row>
        <Content>
          {name && (
            <Label>
              {channelObject.isPrivate && (
                <Icon glyph="private-outline" size={14} />
              )}

              {name}
            </Label>
          )}

          {description && <Description>{description}</Description>}
        </Content>

        <Actions>
          <Icon glyph="view-forward" size={24} />

          {children}
        </Actions>
      </Row>
    </Link>
  );
};

export default ChannelListItem;
