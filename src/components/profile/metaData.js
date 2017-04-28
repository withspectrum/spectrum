import React from 'react';
import pure from 'recompose/pure';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import compose from 'recompose/compose';
import Icon from '../icons';
import Loading from '../loading';
import {
  getUserMetaData,
  getFrequencyMetaData,
  getCommunityMetaData,
} from './queries';
import { Meta, MetaList, MetaListItem, Label, Count } from './style';

const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

const buildArray = (meta: Object): Array<any> => {
  return Object.keys(meta).filter(item => item !== '__typename').map(item => {
    if (item === 'stories') {
      return Object.assign(
        {},
        {
          icon: 'edit',
          label: 'Stories',
          count: meta[item],
        }
      );
    }

    if (item === 'frequencies') {
      return Object.assign(
        {},
        {
          icon: 'emoji',
          label: 'Frequencies',
          count: meta[item],
        }
      );
    }

    if (item === 'subscribers') {
      return Object.assign(
        {},
        {
          icon: 'emoji',
          label: 'Subscribers',
          count: meta[item],
        }
      );
    }

    if (item === 'members') {
      return Object.assign(
        {},
        {
          icon: 'emoji',
          label: 'Members',
          count: meta[item],
        }
      );
    }
  });
};

const MetaDataPure = ({ data, id, type }) => {
  const meta = data[type].metaData;
  const arr = buildArray(meta);

  return (
    <Meta>
      {arr.map((item, i) => {
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

export const UserMetaData = compose(getUserMetaData, displayLoadingState, pure)(
  MetaDataPure
);

export const FrequencyMetaData = compose(
  getFrequencyMetaData,
  displayLoadingState,
  pure
)(MetaDataPure);

export const CommunityMetaData = compose(
  getCommunityMetaData,
  displayLoadingState,
  pure
)(MetaDataPure);
