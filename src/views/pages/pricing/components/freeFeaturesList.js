// @flow
import * as React from 'react';
import {
  FeaturesList,
  FeatureSublabel,
  FeatureDescription,
  Illo,
  ExtraContent,
} from '../style';
import FeatureItem from './featureItem';
import Link from 'src/components/link';
import { Button } from 'src/components/buttons';
import SampleCommunities from './sampleCommunities';

class FreeFeaturesList extends React.Component {
  render() {
    return (
      <FeaturesList>
        <FeatureItem
          title={'Unlimited conversations'}
          subtitle={'Never worry about losing a great conversation again.'}
          priceLabel={'Free'}
          render={() => (
            <ExtraContent>
              <Illo
                right={-40}
                bottom={-40}
                width={300}
                src={'/img/create.svg'}
              />
              <FeatureSublabel>Your history, saved</FeatureSublabel>
              <FeatureDescription isExpanded>
                All conversations are saved, indexed, and searchable forever.
                This makes it easy to find that one message from way-back-when,
                without having to worry about a history limit.
              </FeatureDescription>

              <FeatureSublabel>A better way to talk</FeatureSublabel>
              <FeatureDescription isExpanded>
                Conversations are organized inside of threads where a single
                topic can be discussed over time. There are no limits to how
                many threads your community can have, or how many messages can
                be posted in a thread.
              </FeatureDescription>

              <Link
                style={{ marginTop: '24px', display: 'block' }}
                to={'/thread/06e9bf7c-73ae-449f-a90a-ac4603f7c760'}
              >
                <Button large>See a real conversation</Button>
              </Link>
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'Unlimited members'}
          subtitle={'Never worry about growing too big.'}
          priceLabel={'Free'}
          render={() => (
            <ExtraContent>
              <Illo
                right={-40}
                bottom={30}
                width={200}
                src={'/img/planet-2.svg'}
              />

              <FeatureSublabel>Predictability is key</FeatureSublabel>
              <FeatureDescription isExpanded>
                It can be hard to predict if your community will stay small, or
                might someday have thousands of active members. We don’t set any
                caps on memberships so that you’ll always have peace of mind as
                you grow.
              </FeatureDescription>

              <FeatureSublabel>Keep track of who’s who</FeatureSublabel>
              <FeatureDescription isExpanded>
                As your community grows it’s important to know who people are
                and the background they come from. We’ll keep you notified about
                people as they join, and make it easy to search for the right
                person at any time.
              </FeatureDescription>
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'Unlimited public channels'}
          subtitle={'Stay organized as your community grows.'}
          priceLabel={'Free'}
          render={() => (
            <ExtraContent>
              <Illo
                right={-90}
                bottom={-30}
                width={300}
                style={{ transform: 'scaleX(-1)' }}
                src={'/img/share.svg'}
              />

              <FeatureSublabel>Keep your community organized</FeatureSublabel>
              <FeatureDescription isExpanded>
                As communities grow it can be hard to keep conversations
                organized and grouped together with the right context. Channels
                solve this by letting your members choose where a conversation
                makes the most sense.
              </FeatureDescription>

              <FeatureSublabel>
                A unique community experience for everyone
              </FeatureSublabel>
              <FeatureDescription isExpanded>
                Each channel in a community comes with its own notifications
                settings and permissions. This means that your members can
                choose to subscribe to a subset of channels, eliminating the
                noise and helping people connect with what they care about most.
              </FeatureDescription>
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'Search engine optimized'}
          subtitle={'Grow organically when people discover you through search.'}
          priceLabel={'Free'}
          render={() => (
            <ExtraContent>
              <Illo
                right={-40}
                bottom={-90}
                width={200}
                src={'/img/discover.svg'}
              />

              <FeatureSublabel>Discoverable by default</FeatureSublabel>
              <FeatureDescription isExpanded>
                Conversations and communities are public by default, which means
                they can be indexed and searched from anywhere on the web. This
                makes conversations more accessible and provides long-term value
                to the contributions your members add every day.
              </FeatureDescription>
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'Reputation system'}
          subtitle={
            'Understand the way members contribute to the conversation.'
          }
          priceLabel={'Free'}
          render={() => (
            <ExtraContent>
              <Illo
                right={-50}
                bottom={10}
                width={220}
                src={'/img/cluster-2.svg'}
              />

              <FeatureSublabel>Context is key</FeatureSublabel>
              <FeatureDescription isExpanded>
                Everyone on Spectrum earns reputation based on the quality of
                their contributions back to their communities. This makes it
                easy for community owners and other members to find the people
                are most engaged and most knowledgeable about a specific topic.
              </FeatureDescription>

              <FeatureSublabel>How it works</FeatureSublabel>
              <FeatureDescription isExpanded>
                We provide a score to different kinds of interactions on
                Spectrum. When people start or join conversations, they earn
                reputation for adding value back to a community. But we also
                looker deeper into the interactions that happen downstream from
                each person’s activity in order to ensure that conversations are
                healthy and productive, rather than sensationalist or
                provacative.
              </FeatureDescription>
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'Ad-free'}
          subtitle={
            'Your community’s data is never sold to advertisers or third parties.'
          }
          priceLabel={'Free'}
          render={() => (
            <ExtraContent>
              <Illo
                right={-20}
                bottom={180}
                width={200}
                style={{ transform: 'scaleX(-1)' }}
                src={'/img/planet-1.svg'}
              />

              <FeatureSublabel>Aligned incentives</FeatureSublabel>
              <FeatureDescription isExpanded>
                Ad-driven business models have misaligned community platform
                incentives for years. The result is tools that optimize for the
                wrong metrics, ignoring what actually matters to your community.
                When we don’t sell your data to advertisers, we can be
                completely focused on making sure your community is successful
                in all the right measures.
              </FeatureDescription>

              <FeatureSublabel>Own your data</FeatureSublabel>
              <FeatureDescription isExpanded>
                As a result of being ad-free, there is no incentive for Spectrum
                to ever sell or compromise the security of your community’s
                data. Your community’s data belongs to your community.
              </FeatureDescription>
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'A new home'}
          subtitle={'Create your own space for your community to thrive.'}
          priceLabel={'Free'}
          render={() => (
            <ExtraContent>
              <FeatureSublabel>A space</FeatureSublabel>
              <FeatureDescription isExpanded>
                Every community on Spectrum has their own dedicated page where
                people can discover content, explore channels, start
                conversations, and see who else is in the community. Check out
                some example communities:
              </FeatureDescription>

              <SampleCommunities
                curatedContentType={'top-communities-by-members'}
              />
            </ExtraContent>
          )}
        />
      </FeaturesList>
    );
  }
}

export default FreeFeaturesList;
