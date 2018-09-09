import React from 'react';
import styled from 'styled-components';
import { Typography } from '@smooth-ui/core-sc'

const StyledWrapper = styled.div`
  margin: 30px 0 10px;
`;

const StyledList = styled.ul`
  margin: 10px 0;
  font-size: 1.5rem;
  font-weight: 300;
  color: #444;
`;

const Summary = () => (
  <StyledWrapper className='summary'>
    <Typography variant="h2">Career Summary</Typography>
    <StyledList>
      <li>10+ years of professional experience in software engineering.</li>
      <li>Mainly in e-commerce markets. Vast experience working with geo distributed teams.</li>
      <li>Skills in communication, analysis and quality for software development.</li>
      <li>Comfortable on communicating with clients on regular basis.</li>
      <li>Comfortable also with the use of Agile methodologies.</li>
      <li>As a web-oriented developer, I has worked with high traffic websites using SOA architectures mostly, but not only.</li>
      <li>Value discipline, excellence and product orientation.</li>
    </StyledList>

    <Typography variant="h2" style={{marginTop: '30px'}}>Proeficient in</Typography>
    <StyledList>
      <li>Teams management using Agile Methodologies (Scrum).</li>
      <li>Software engineering.</li>
      <li>Motivation and leadership skills.</li>
      <li>Risk management.</li>
      <li>Web Based systems.</li>
      <li>Javascript</li>
      <li>Styling</li>
    </StyledList>

    <Typography variant="h2" style={{ marginTop: '30px' }}>Languages</Typography>
    <StyledList>
      <li>Spanish (native speaker).</li>
      <li>English (quite good).</li>
    </StyledList>
  </StyledWrapper>
);

export default Summary;