import React from 'react';
import styled from 'styled-components';

const StyledIntro = styled.div`
  font-size: 2.5rem;
  line-height: 3rem
  text-align: center;
  margin: 60px 0 50px;
`;

const Introduction = () => (
  <StyledIntro className='introduction'>
    I am a front-end developer passionate about learning while creating robust well-finished products. 
  </StyledIntro>
);

export default Introduction;