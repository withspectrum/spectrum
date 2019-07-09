// @flow
import React, { useState, useEffect } from 'react';
// $FlowFixMe
import parseGithubUrl from 'parse-github-url';
import { Container, Column, GitHubBadge } from './style';
import { ThreadTitle } from 'src/components/inboxThread/style';
import { InnerMessageContainer } from '../style';

const GitHubAttachment = (props: { url: string }) => {
  const { url } = props;

  const [urlData, setUrlData] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let data;
    try {
      data = parseGithubUrl(url);
    } catch (err) {
      setError(true);
    }
    setUrlData(data);
    setError(false);
  });

  useEffect(() => {
    if (
      !urlData.href ||
      !urlData.branch ||
      !urlData.filepath ||
      !urlData.repo
    ) {
      setError(true);
    }
  }, [urlData]);

  let attachment;

  if (error) {
    attachment = attachment = <a href={url}>{url}</a>;
  } else {
    attachment = (
      <div className="attachment-container">
        <Container data-cy="github-attachment">
          <Column>
            <a href={urlData.href}>
              <ThreadTitle>
                {`${
                  urlData.branch === 'issues' ? 'Issue' : 'Pull Request'
                } ·  `}
                <GitHubBadge color={'#5319e7'}>#{urlData.filepath}</GitHubBadge>
              </ThreadTitle>
            </a>
            <InnerMessageContainer style={{ fontSize: '12px' }}>
              {`${urlData.repo}`}
            </InnerMessageContainer>
          </Column>
        </Container>
      </div>
    );
  }

  return attachment;
};

export default GitHubAttachment;
