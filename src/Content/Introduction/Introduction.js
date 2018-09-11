import React from 'react';
import styled from 'styled-components';
import data from '../../info.json';

const StyledIntro = styled.div`
  font-size: 2.5rem;
  line-height: 3rem
  text-align: center;
  margin: 60px 0 50px;
`;

const Introduction = () => (
  <StyledIntro className='introduction'>
    {data.sections.introduction}
  </StyledIntro>
);

export default Introduction;