// @flow
import React, { useState, useEffect } from 'react';
// $FlowFixMe
import parseGithubUrl from 'parse-github-url';
import { Container, Column, GithubBadge } from './style';
import { ThreadTitle } from 'src/components/inboxThread/style';
import { InnerMessageContainer } from '../style';

const GithubAttachment = (props: { url: string }) => {
  const { url } = props;

  const [urlData, setUrlData] = useState({});

  useEffect(() => {
    let data;
    try {
      data = parseGithubUrl(url);
    } catch (err) {
      return;
    }
    setUrlData(data);
  });

  let attachment;

  if (urlData.href && urlData.branch && urlData.filepath && urlData.repo) {
    attachment = (
      <div className="attachment-container">
        <Container data-cy="github-attachment">
          <Column>
            <a href={urlData.href}>
              <ThreadTitle>
                {`${
                  urlData.branch === 'issues' ? 'Issue' : 'Pull Request'
                } ·  `}
                <GithubBadge color={'#5319e7'}>#{urlData.filepath}</GithubBadge>
              </ThreadTitle>
            </a>
            <InnerMessageContainer style={{ fontSize: '12px' }}>
              {`${urlData.repo}`}
            </InnerMessageContainer>
          </Column>
        </Container>
      </div>
    );
  } else {
    attachment = <a href={url}>{url}</a>;
  }

  return attachment;
};

export default GithubAttachment;
