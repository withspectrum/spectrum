// @flow
import React from 'react';
import styled from 'styled-components/native';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Svg } from 'expo';
const { Path, G } = Svg;
import theme from '../theme';

export const Container = (props: any) => {
  const Container = styled.View`
    padding: 32px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  return (
    <ScrollView>
      <Container>{props.children}</Container>
    </ScrollView>
  );
};

export const Emoji = () => (
  <Svg
    preserveAspectRatio="xMidYMid meet"
    fill-rule="evenodd"
    clip-rule="evenodd"
    stroke-linejoin="rounda"
    stroke-miterlimit="1.414"
    width="64"
    height="64"
    viewBox="0 0 32 32"
  >
    <G>
      <Path
        fill={theme.text.alt}
        d="M26,16c0,5.523 -4.477,10 -10,10c-5.523,0 -10,-4.477 -10,-10c0,-5.523 4.477,-10 10,-10c5.523,0 10,4.477 10,10Zm2,0c0,6.627 -5.373,12 -12,12c-6.627,0 -12,-5.373 -12,-12c0,-6.627 5.373,-12 12,-12c6.627,0 12,5.373 12,12Zm-17.5,0c0.829,0 1.5,-0.672 1.5,-1.5c0,-0.828 -0.671,-1.5 -1.5,-1.5c-0.829,0 -1.5,0.672 -1.5,1.5c0,0.828 0.671,1.5 1.5,1.5Zm12.5,-1.5c0,0.828 -0.671,1.5 -1.5,1.5c-0.829,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.671,-1.5 1.5,-1.5c0.829,0 1.5,0.672 1.5,1.5Zm-6.999,8c2.45,0 4.534,-1.715 5,-4c0.232,-1.14 -3,-1.5 -5,-1.5c-2,0 -5.259,0.231 -5,1.5c0.466,2.285 2.549,4 5,4Zm2,-2c0,0 -0.896,0.5 -2,0.5c-1.105,0 -2,-0.5 -2,-0.5c0,0 0.895,-1 2,-1c1.104,0 2,1 2,1Z"
      />
    </G>
  </Svg>
);

export const Title = styled.Text`
  color: ${props => props.theme.text.default};
  font-size: 40px;
  font-weight: 900;
  text-align: center;
`;

export const Subtitle = styled.Text`
  color: ${props => props.theme.text.alt};
  font-weight: 500;
  font-size: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  text-align: center;
  padding: 0px 32px;
`;

type SigninButtonProps = {
  color: string,
  children: React$Node,
  onPress: Function,
};
const SigninButton = ({ color, children, onPress }: SigninButtonProps) => {
  const Container = styled.TouchableOpacity`
    width: 220px;
    height: 51px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    padding: 8px;
    margin-top: 16px;
    padding-right: 16px;
    background-color: ${color};
  `;

  return <Container onPress={onPress}>{children}</Container>;
};

SigninButton.Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

SigninButton.Title = styled.Text`
  flex-grow: 1;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

type IconProps = {|
  d: string,
|};
SigninButton.Icon = (props: IconProps) => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32">
      <G>
        <Path fill="#fff" d={props.d} />
      </G>
    </Svg>
  );
};

type SocialButtonProps = {|
  onPress: Function,
|};

export const TwitterButton = ({ onPress }: SocialButtonProps) => {
  const { Container, Icon, Title } = SigninButton;

  return (
    <SigninButton onPress={onPress} color={theme.social.twitter.default}>
      <Container>
        <Icon d="M16,28c11,0 12,-1 12,-12c0,-11 -1,-12 -12,-12c-11,0 -12,1 -12,12c0,11 1,12 12,12Zm5.825,-13.901c0,3.669 -2.889,7.901 -8.172,7.901l0,0c-1.622,0 -3.132,-0.46 -4.403,-1.248c0.225,0.026 0.454,0.039 0.685,0.039c1.346,0 2.585,-0.444 3.568,-1.189c-1.258,-0.022 -2.318,-0.825 -2.684,-1.928c0.175,0.032 0.355,0.05 0.54,0.05c0.262,0 0.516,-0.034 0.758,-0.098c-1.315,-0.255 -2.305,-1.377 -2.305,-2.722c0,-0.013 0,-0.024 0.001,-0.036c0.387,0.208 0.829,0.333 1.301,0.348c-0.772,-0.498 -1.279,-1.348 -1.279,-2.312c0,-0.509 0.143,-0.985 0.389,-1.396c1.417,1.681 3.534,2.786 5.921,2.902c-0.049,-0.204 -0.074,-0.416 -0.074,-0.633c0,-1.533 1.286,-2.777 2.872,-2.777c0.826,0 1.573,0.338 2.097,0.877c0.654,-0.124 1.269,-0.356 1.824,-0.674c-0.215,0.649 -0.67,1.192 -1.263,1.536c0.581,-0.067 1.134,-0.216 1.649,-0.437c-0.384,0.557 -0.872,1.046 -1.433,1.438c0.006,0.119 0.008,0.239 0.008,0.359Z" />
        <Title>Sign in with Twitter</Title>
      </Container>
    </SigninButton>
  );
};

export const FacebookButton = ({ onPress }: SocialButtonProps) => {
  const { Container, Icon, Title } = SigninButton;

  return (
    <SigninButton onPress={onPress} color={theme.social.facebook.default}>
      <Container>
        <Icon d="M19.491,27.944c7.731,-0.319 8.509,-2.242 8.509,-11.944c0,-11 -1,-12 -12,-12c-11,0 -12,1 -12,12c0,10.985 0.997,11.997 11.956,12l0,-7.667l-2.956,0l0,-3.377l2.956,0l0,-2.491c0,-2.891 1.789,-4.465 4.403,-4.465c1.251,0 2.327,0.092 2.641,0.133l0,3.021l-1.813,0.001c-1.421,0 -1.696,0.666 -1.696,1.644l0,2.157l3.39,0l-0.442,3.377l-2.948,0l0,7.611Z" />
        <Title>Sign in with Facebook</Title>
      </Container>
    </SigninButton>
  );
};

export const GoogleButton = ({ onPress }: SocialButtonProps) => {
  const { Container, Icon, Title } = SigninButton;

  return (
    <SigninButton onPress={onPress} color={theme.social.google.default}>
      <Container>
        <Icon d="M16,28c11,0 12,-1 12,-12c0,-11 -1,-12 -12,-12c-11,0 -12,1 -12,12c0,11 1,12 12,12Zm0.142,-10.558l0,-2.675l6.731,0.01c0.588,2.728 -0.735,8.223 -6.731,8.223c-3.944,0 -7.142,-3.134 -7.142,-7c0,-3.866 3.198,-7 7.142,-7c1.852,0 3.54,0.691 4.81,1.825l-2.01,1.97c-0.754,-0.633 -1.73,-1.017 -2.8,-1.017c-2.379,0 -4.308,1.89 -4.308,4.222c0,2.332 1.929,4.222 4.308,4.222c1.998,0 3.38,-1.159 3.888,-2.78l-3.888,0Z" />
        <Title>Sign in with Google</Title>
      </Container>
    </SigninButton>
  );
};

export const GithubButton = ({ onPress }: SocialButtonProps) => {
  const { Container, Icon, Title } = SigninButton;

  return (
    <SigninButton onPress={onPress} color={theme.social.github.default}>
      <Container>
        <Icon d="M18.837,27.966c8.342,-0.241 9.163,-1.997 9.163,-11.966c0,-11 -1,-12 -12,-12c-11,0 -12,1 -12,12c0,9.995 0.826,11.734 9.228,11.968c0.073,-0.091 0.1,-0.205 0.1,-0.321c0,-0.25 -0.01,-2.816 -0.015,-3.699c-3.037,0.639 -3.678,-1.419 -3.678,-1.419c-0.497,-1.222 -1.213,-1.548 -1.213,-1.548c-0.991,-0.656 0.075,-0.643 0.075,-0.643c1.096,0.075 1.673,1.091 1.673,1.091c0.974,1.617 2.556,1.15 3.178,0.879c0.099,-0.683 0.381,-1.15 0.693,-1.414c-2.425,-0.267 -4.974,-1.175 -4.974,-5.23c0,-1.155 0.426,-2.099 1.124,-2.839c-0.113,-0.268 -0.487,-1.344 0.107,-2.8c0,0 0.917,-0.285 3.003,1.084c0.871,-0.235 1.805,-0.352 2.734,-0.356c0.927,0.004 1.861,0.121 2.734,0.356c2.085,-1.369 3,-1.084 3,-1.084c0.596,1.456 0.221,2.532 0.108,2.8c0.7,0.74 1.123,1.684 1.123,2.839c0,4.065 -2.553,4.96 -4.986,5.221c0.392,0.327 0.741,0.973 0.741,1.96c0,0.946 -0.006,2.619 -0.01,3.728c-0.002,0.549 -0.003,0.959 -0.003,1.074c0,0.109 0.029,0.224 0.095,0.319Z" />
        <Title>Sign in with Github</Title>
      </Container>
    </SigninButton>
  );
};
