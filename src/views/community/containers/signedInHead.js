// @flow
import React, { useState, useEffect } from 'react';
import Head from 'src/components/head';
import generateMetaInfo from 'shared/generate-meta-info';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';

type Props = {
  community: CommunityInfoType,
};

const SignedInHead = (props: Props) => {
  const { community } = props;
  const [metaInfo, setMetaInfo] = useState(
    generateMetaInfo({
      type: 'community',
      data: {
        name: community.name,
        description: community.description,
      },
    })
  );

  useEffect(() => {
    setMetaInfo(
      generateMetaInfo({
        type: 'community',
        data: {
          name: `${community.name} community`,
          description: community.description,
        },
      })
    );
  }, [community.id]);

  const { title, description } = metaInfo;

  return (
    <Head
      title={title}
      description={description}
      image={community.profilePhoto}
    >
      {community.redirect && community.noindex && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      {community.profilePhoto && (
        <meta name="twitter:card" content="summary_large_image" />
      )}
    </Head>
  );
};

export default SignedInHead;
