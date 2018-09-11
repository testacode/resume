import React from 'react';
import styled from 'styled-components';

import Introduction from './Introduction';
import Summary from './Summary';
import Skills from './Skills';
import Experience from './Experience';
import AdditionalInformation from './AdditionalInformation';

const StyledContent = styled.div`
  width: 60rem;
`;

const Content = () => (
  <StyledContent className='content'>
    <Introduction />
    <Summary />
    <Skills />
    <Experience />
    <AdditionalInformation />
  </StyledContent>
);

export default Content;