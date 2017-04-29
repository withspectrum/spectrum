//@flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
import Icon from '../icons';
import { Meta, MetaList, MetaListItem, Label, Count } from './style';

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

const MetaDataPure = ({ data, type }) => {
  const meta = data[type].metaData;
  const arr = buildArray(meta);

  return (
    <Meta>
      <MetaList>
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
      </MetaList>
    </Meta>
  );
};

export const MetaData = pure(MetaDataPure);
