// @flow
import React, { useState, useEffect } from 'react';
import path from 'path';
// $FlowFixMe
import parseGithubUrl from 'parse-github-url';
import { Loading } from 'src/components/loading';
import { Container, Column, GitHubBadge } from './style';
import { ThreadTitle } from 'src/components/inboxThread/style';
import { InnerMessageContainer } from '../style';

const GitHubAttachment = (props: { url: string }) => {
  const { url } = props;
  const [apiData, setApiData] = useState(null);
  const [urlData] = useState(parseGithubUrl(url));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [validUrl, setValidUrl] = useState(true);

  useEffect(() => {
    // if the request takes longer than timeout, fallback case is triggered.
    // When request completes it either fails or succeeds and updates attachment
    const fetchData = async () => {
      let fetchTimeOut = setTimeout(() => {
        setError(true);
        setLoading(false);
      }, 4000);

      try {
        const apiUrl = path.join('https://api.github.com/repos/', urlData.path);
        const response = await fetch(apiUrl);

        switch (response.status) {
          case 200: {
            const json = await response.json();
            clearTimeout(fetchTimeOut);
            setApiData(json);
            setError(false);
            setLoading(false);
            break;
          }
          case 404: {
            clearTimeout(fetchTimeOut);
            setValidUrl(false);
            setLoading(false);
            break;
          }
          default: {
            throw new Error('Failed Response');
          }
        }
      } catch (err) {
        clearTimeout(fetchTimeOut);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let attachment;

  if (!validUrl) {
    attachment = <a href={url}>{url}</a>; // spit out broken link
  } else if (error) {
    const title = urlData.branch === 'issues' ? 'Issue' : 'Pull Request';
    attachment = (
      <div className="attachment-container">
        <Container data-cy="thread-attachment">
          <Column>
            <a href={urlData.href}>
              <ThreadTitle>
                {`${title} · #${urlData.filepath} `}
                <GitHubBadge color="#ebedf0">status unknown</GitHubBadge>
              </ThreadTitle>
            </a>
            <InnerMessageContainer style={{ fontSize: '12px' }}>
              {`${urlData.repo} `}
            </InnerMessageContainer>
          </Column>
        </Container>
      </div>
    );
  } else if (loading || !apiData) {
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
