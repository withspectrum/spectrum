//@flow
import React from 'react';
import Icon from 'src/components/icon';
import { Meta, MetaList, MetaListItem, Label, Count } from './style';

/*
  Brian:
  Given the type of metadata we want to render, we need to hardcode a label and
  icon for the UI. A big if-return function like this feels messy, but is relatively
  easy to extend or modify as needed
*/
const buildArray = (meta: Object): Array<any> => {
  // Apollo returns a __typename field in the data object; filter it out
  return Object.keys(meta)
    .filter(item => item !== '__typename')
    .map(item => {
      if (item === 'threads') {
        return Object.assign(
          {},
          {
            icon: 'post',
            label: 'Threads',
            count: meta[item],
          }
        );
      }

      if (item === 'channels') {
        return Object.assign(
          {},
          {
            icon: 'channel',
            label: 'Channels',
            count: meta[item],
          }
        );
      }

      if (item === 'subscribers') {
        return Object.assign(
          {},
          {
            icon: 'person',
            label: 'Subscribers',
            count: meta[item],
          }
        );
      }

      if (item === 'members') {
        return Object.assign(
          {},
          {
            icon: 'person',
            label: 'Members',
            count: meta[item],
          }
        );
      }

      return {};
    });
};

export const MetaData = ({ data }: any) => {
  const arr = buildArray(data);

  return (
    <Meta>
      <MetaList>
        {arr.map((item, i) => {
          return (
            <MetaListItem key={i}>
              <Label>
                <Icon glyph={item.icon} />
                <span>{item.label}</span>
              </Label>
              <Count>{item.count}</Count>
            </MetaListItem>
          );
        })}
      </MetaList>
    </Meta>
  );
};
