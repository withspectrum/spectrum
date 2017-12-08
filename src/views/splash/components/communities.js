import React, { PureComponent } from 'react';
import styled from 'styled-components';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import Icon from '../../../components/icons';
import Avatar from '../../../components/avatar';
import { Button } from '../../../components/buttons';
import { getCommunity } from '../../explore/queries';
import {
  zIndex,
  hexa,
  Shadow,
  Gradient,
  FlexCol,
  FlexRow,
  H1,
  H2,
  Span,
  P,
  Transition,
} from '../../../components/globals';

const Community = styled.div`
  width: 400px;
  height: 160px;
  background-color: ${props => props.theme.bg.default};
  box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.15)};
  position: relative;
  margin-left: 64px;
  transition: ${Transition.hover.off};

  &:hover {
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.brand.alt, 0.5)};
    transition: ${Transition.hover.on};
  }

  & + & {
    margin-top: 16px;
  }

  &:first-of-type {
    right: -128px;
  }

  &:last-of-type {
    right: 128px;
  }
`;

class CommunityWithData extends PureComponent {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  render() {
    const { data: { community, loading, error } } = this.props;
    const { isLoading } = this.state;

    return <Community>{community.name}</Community>;
  }
}

export const CommunityProfile = compose(getCommunity)(Community);

export const Communities = () => {
  return (
    <div>
      <CommunityProfile slug={'spectrum'} />
    </div>
  );
};
