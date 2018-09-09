import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StyledSuperTitle = styled.h1`
  display: inline-block;
  margin: 30px 0 8px;
  padding: 25px 20px;
  border-radius: 0 12px;
  background-color: black;
  color: white;
  font-size: 3.1rem;
  font-family: Georgia, serif;
  font-style: italic;
  letter-spacing: .1rem;
`;

const StyledH2 = styled.h2`
  margin: 0;
  font-weight: 600;
  text-align: center;
  font-size: 2.15rem;
`;

const Header = () => (
  <StyledWrapper className='header'>
    <StyledSuperTitle>Carlos Monti</StyledSuperTitle>
    <StyledH2>Senior Front-End Developer</StyledH2>
  </StyledWrapper>
);

export default Header;