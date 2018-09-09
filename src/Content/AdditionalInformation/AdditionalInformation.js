import React from 'react';
import styled from 'styled-components';
import { Typography } from '@smooth-ui/core-sc';

const StyledInfo = styled.div`
`;

const StyledList = styled.ul`
  font-size: 1.5rem;
  font-weight: 300;
  color: #444;
`;

const AdditionalInformation = () => (
  <StyledInfo className='additional-information'>
    <Typography variant='h3'>Additional Information</Typography> 
    <StyledList>
      <li>I have an 11 year old daughter called Alma.</li>
      <li>I love to travel.</li>
      <li>I like playing with arduinos (IoT).</li>
      <li>I play the guitar and sing when I can.</li>
    </StyledList>
  </StyledInfo>
);

export default AdditionalInformation;