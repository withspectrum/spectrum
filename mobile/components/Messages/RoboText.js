// @flow
import React from 'react';
import { RoboWrapper, Hr, RoboText } from './style';

type Props = {
  children: string,
};

export const TimestampRoboText = ({ children }: Props) => {
  return (
    <RoboWrapper>
      <Hr color={theme => theme.bg.hairline} />
      <RoboText color={theme => theme.text.alt}>{children}</RoboText>
      <Hr color={theme => theme.bg.hairline} />
    </RoboWrapper>
  );
};

export const UnseenRoboText = ({ children, color }: Props) => {
  return (
    <RoboWrapper>
      <Hr color={theme => theme.warn.alt} />
      <RoboText color={theme => theme.warn.alt}>{children}</RoboText>
      <Hr color={theme => theme.warn.alt} />
    </RoboWrapper>
  );
};
