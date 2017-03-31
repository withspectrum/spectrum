import React, { Component } from 'react';
import { featured } from '../../../helpers/featuredFrequencies';
import Icon from '../../../shared/Icons';
import { IconButton, Button, FlexCol, FlexRow } from '../../../shared/Globals';
import {
  Wrapper,
  ViewTitle,
  ViewSubtitle,
  FeaturedSection,
  FeaturedRow,
  FeaturedItem,
  FeaturedItemImage,
  FeaturedItemMeta,
  FeaturedItemTitle,
  FeaturedItemCopy,
  SecondaryRow,
  SecondaryItem,
  SectionTitle,
  ChartSection,
  ChartRow,
  Chart,
  ScrollBody,
  Rank,
} from './style';

class Explore extends Component {
  render() {
    return (
      <Wrapper>
        <ScrollBody>
          <ViewTitle>Explore</ViewTitle>
          <ViewSubtitle>Let's find you some cool stuff!</ViewSubtitle>
          <FeaturedSection>
            <SectionTitle>
              Check out some of our favorite Frequencies...
            </SectionTitle>
            <FeaturedRow>
              <FeaturedItem>
                <FeaturedItemImage src="/img/react.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~React</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~React"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    Ever want to learn about the hot new JavaScript framework?
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/spec.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~SpecFM</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~SpecFM"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    The podcast network that started all of this nonsense...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/music.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~Music</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~Music"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    A great place to discuss the music you're vibin' to...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/music.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~Music</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~Music"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    A great place to discuss the music you're vibin' to...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/music.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~Music</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~Music"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    A great place to discuss the music you're vibin' to...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/music.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~Music</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~Music"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    A great place to discuss the music you're vibin' to...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
            </FeaturedRow>
          </FeaturedSection>
          <SecondaryRow>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>💅</h1>
              <h3>~Styled-Components</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
            <SecondaryItem>
              <h1>🌈</h1>
              <h3>~Spectrum</h3>
              <Button>Join</Button>
            </SecondaryItem>
          </SecondaryRow>
          <ChartSection>
            <Chart>
              <SectionTitle>Latest</SectionTitle>
              <ScrollBody>
                <ChartRow>
                  <Rank>1</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>2</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>3</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>4</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>5</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>6</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>7</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>8</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>9</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>10</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>11</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>12</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>13</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>14</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>15</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
              </ScrollBody>
            </Chart>
            <Chart>
              <SectionTitle>Most Popular</SectionTitle>
              <ScrollBody>
                <ChartRow>
                  <Rank>1</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>2</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>3</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>4</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>5</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>6</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>7</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>8</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>9</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>10</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>11</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>12</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>13</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>14</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>15</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
              </ScrollBody>
            </Chart>
          </ChartSection>
        </ScrollBody>
      </Wrapper>
    );
  }
}

export default Explore;
