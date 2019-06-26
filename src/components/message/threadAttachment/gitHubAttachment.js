// @flow
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import { Loading } from 'src/components/loading';
import { Container, Column, GitHubBadge } from './style';
import { ThreadTitle } from 'src/components/inboxThread/style';
import { InnerMessageContainer } from '../style';
import parseGithubUrl from 'parse-github-url';

const GitHubAttachment = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState({ title: '' });
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

  if (loading)
    return (
      <Container style={{ padding: '16px 12px' }}>
        <Loading />
      </Container>
    );

  return (
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
};

GitHubAttachment.propTypes = {
  url: PropTypes.string.isRequired,
};

export default GitHubAttachment;
