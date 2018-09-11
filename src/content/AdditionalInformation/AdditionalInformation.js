import React from 'react';
import { uniqueId } from 'lodash';
import styled from 'styled-components';

import { Typography } from '@smooth-ui/core-sc';
import data from '../../info.json';

const StyledList = styled.ul`
  font-size: 1.5rem;
  font-weight: 300;
  color: #444;
`;

const { information } = data.sections;

const AdditionalInformation = () => (
  <div className='additional-information'>
    <Typography variant='h3'>{information.title}</Typography> 
    <StyledList>
      {information.items.map(item => (
        <li key={uniqueId()}>{item}</li>
      ))}
    </StyledList>
  </div>
);

export default AdditionalInformation;