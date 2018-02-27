// @flow
import * as React from 'react';
import {
  FeaturesList,
  FeatureSublabel,
  FeatureDescription,
  IlloOne,
  IlloTwo,
  IlloThree,
  ExtraContent,
} from '../style';
import FeatureItem from './featureItem';
import Link from 'src/components/link';
import { Button } from 'src/components/buttons';

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
              <IlloOne src={'/img/cluster-2.svg'} />
              <FeatureSublabel>Your history, saved</FeatureSublabel>
              <FeatureDescription isExpanded>
                All conversations are saved, indexed, and searchable forever.
                This makes it easy to find that one message from way-back-when,
                without having to worry about a history limit.
              </FeatureDescription>

              <FeatureSublabel>A better way to talk</FeatureSublabel>
              <FeatureDescription isExpanded>
                Conversations are organized inside of threads where a discrete
                topic can be discussed over any period of time. There are no
                limits to how many threads your community can have, or how many
                messages can be posted in any thread.
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
              <IlloTwo src={'/img/planet-2.svg'} />

              <FeatureSublabel>Predictability is key</FeatureSublabel>
              <FeatureDescription isExpanded>
                It can bbe hard to predict if your community will stay small, or
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
              <IlloTwo src={'/img/planet-2.svg'} />

              <FeatureSublabel>Keep your community organized</FeatureSublabel>
              <FeatureDescription isExpanded>
                As communities grow it can be hard to keep conversations
                organized and grouped together with the right context. Spectrum
                channels solve this by letting your members choose where a
                conversation makes the most sense.
              </FeatureDescription>

              <FeatureSublabel>
                A unique experience for everyone
              </FeatureSublabel>
              <FeatureDescription isExpanded>
                Each channel in a community comes with its own notifications
                settions and viewing permissions. This means that members can
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
              <IlloThree src={'/img/discover.svg'} />

              <FeatureSublabel>Discoverable by default</FeatureSublabel>
              <FeatureDescription isExpanded>
                Conversations and communities are public by default, which means
                they can be indexed and searched from any search engine. This
                change makes conversations more accessible and provides
                long-term value to the contributions your memers make every day.
              </FeatureDescription>

              <FeatureSublabel>Give it a try</FeatureSublabel>
              <FeatureDescription isExpanded>
                Try searching for a topic below and see where people on Spectrum
                are talking.
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
              <IlloTwo src={'/img/planet-2.svg'} />

              <FeatureSublabel>Context is key</FeatureSublabel>
              <FeatureDescription isExpanded>
                Everyone on Spectrum earns reputation based on the quality of
                their contributions back to communities where they are members.
                This makes it easy for community owners and other members to
                find the people are most engaged and most knowledgeable about a
                specific topic.
              </FeatureDescription>

              <FeatureSublabel>How it works</FeatureSublabel>
              <FeatureDescription isExpanded />
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'Ad-free'}
          subtitle={
            'Your community’s data is never sold to advertisers or third parties.'
          }
          priceLabel={'Free'}
        />

        <FeatureItem
          title={'A new home'}
          subtitle={'Create your own space for your community to thrive.'}
          priceLabel={'Free'}
        />
      </FeaturesList>
    );
  }
}

export default FreeFeaturesList;
