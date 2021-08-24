// @flow
import * as React from 'react';
import Icon from 'src/components/icon';
import { Bar, Content } from './style';
class Banner extends React.Component<{}> {
  render() {
    return (
      <Bar>
        <Content>
          <Icon glyph="announcement" size="24" />
          <p>
            Spectrum is now read-only. Learn more about the decision in our{' '}
            <a
              href={
                'https://spectrum.chat/spectrum/general/join-us-on-our-new-journey~e4ca0386-f15c-4ba8-8184-21cf5fa39cf5'
              }
            >
              official announcement
            </a>
            .
          </p>
        </Content>
      </Bar>
    );
  }
}

export default Banner;
