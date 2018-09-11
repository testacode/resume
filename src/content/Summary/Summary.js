import React, { Fragment } from 'react';
import { uniqueId } from 'lodash';
import styled from 'styled-components';

import { Typography } from '@smooth-ui/core-sc';
import data from '../../info.json';

const { sections: { summary } } = data;

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
    {summary.map(block => (
      <Fragment key={uniqueId()}>
        <Typography variant="h2">{block.title}</Typography>
        <StyledList>
          {block.items.map(item => (
            <li key={uniqueId()}>{item}</li>
          ))}
        </StyledList>
      </Fragment>
    ))}
  </StyledWrapper>
);

export default Summary;