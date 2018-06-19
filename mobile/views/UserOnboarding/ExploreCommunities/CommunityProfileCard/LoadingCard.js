// @flow
import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import { withTheme } from 'styled-components';
import { CommunityCardWrapper } from './style';

type Props = {
  theme: Object,
};

const { width } = Dimensions.get('window');

class LoadingCard extends React.Component<Props> {
  render() {
    const { theme } = this.props;

    return (
      <CommunityCardWrapper>
        <View>
          <Svg height={260} width={width * 0.6}>
            <Svg.Rect
              fill={theme.bg.wash}
              x="0"
              y="0"
              rx="4"
              ry="4"
              width="44"
              height="44"
            />
            <Svg.Rect
              fill={theme.bg.wash}
              x="0"
              y="60"
              rx="4"
              ry="4"
              width={width * 0.6 - 32}
              height="12"
            />
            <Svg.Rect
              fill={theme.bg.wash}
              x="0"
              y="80"
              rx="2"
              ry="2"
              width={width * 0.6 - 92}
              height="8"
            />

            <Svg.Rect
              fill={theme.bg.wash}
              x="0"
              y="112"
              rx="2"
              ry="2"
              width={width * 0.6 - 64}
              height="8"
            />
            <Svg.Rect
              fill={theme.bg.wash}
              x="0"
              y="128"
              rx="2"
              ry="2"
              width={width * 0.6 - 108}
              height="8"
            />
            <Svg.Rect
              fill={theme.bg.wash}
              x="0"
              y="144"
              rx="2"
              ry="2"
              width={width * 0.6 - 88}
              height="8"
            />
          </Svg>
        </View>
      </CommunityCardWrapper>
    );
  }
}

export default withTheme(LoadingCard);
