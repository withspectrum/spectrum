import React from 'react';
import pure from 'recompose/pure';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import compose from 'recompose/compose';
import Icon from '../icons';
import Loading from '../loading';
import { getUserMetaData } from './queries';
import { Meta, MetaList, MetaListItem, Label, Count } from './style';

const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

const MetaDataPure = ({ data: { user: { metaData } }, id }) => {
  const meta = [
    { icon: 'edit', label: 'Stories', count: metaData.storiesCount },
  ];

  return (
    <Meta>
      {meta.map((item, i) => {
        return (
          <MetaListItem key={i}>
            <Label>
              <Icon
                icon={item.icon}
                color={'text.alt'}
                hoverColor={'text.alt'}
                scaleOnHover={false}
                size={24}
              />
              {item.label}
            </Label>
            <Count>{item.count}</Count>
          </MetaListItem>
        );
      })}
    </Meta>
  );
};

const MetaData = compose(getUserMetaData, displayLoadingState, pure)(
  MetaDataPure
);

export default MetaData;
