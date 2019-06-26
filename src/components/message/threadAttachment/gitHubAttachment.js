// @flow
import React, { useState, useEffect } from 'react';
import path from 'path';
import parseGithubUrl from 'parse-github-url';
import { Loading } from 'src/components/loading';
import { Container, Column, GitHubBadge } from './style';
import { ThreadTitle } from 'src/components/inboxThread/style';
import { InnerMessageContainer } from '../style';

const GitHubAttachment = (props: { url: string }) => {
  const { url } = props;
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [urlData] = useState(parseGithubUrl(url));

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = path.join('https://api.github.com/repos/', urlData.path);
      const result = await fetch(apiUrl);
      const json = await result.json();
      setApiData(json);
      setLoading(false);
    };

    fetchData();
  }, []);

  let attachment;

  if (loading || !apiData) {
    attachment = (
      <Container style={{ padding: '16px 12px' }}>
        <Loading />
      </Container>
    );
  } else {
    attachment = (
      <div className="attachment-container">
        <Container data-cy="thread-attachment">
          <Column>
            <a href={apiData.html_url}>
              <ThreadTitle>
                {`${apiData.title} · #${apiData.number} `}
                <GitHubBadge
                  color={apiData.state === 'open' ? '#2cbe4e' : '#cb2431'}
                >
                  {apiData.state}
                </GitHubBadge>
              </ThreadTitle>
            </a>
            <InnerMessageContainer style={{ fontSize: '12px' }}>
              {`${urlData.repo} · ${apiData.user.login}`}
            </InnerMessageContainer>
          </Column>
        </Container>
      </div>
    );
  }

  return attachment;
};

export default GitHubAttachment;
