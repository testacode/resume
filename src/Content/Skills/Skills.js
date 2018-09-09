import React from 'react';
import styled from 'styled-components';
import { Grid, Row, Col, Typography } from '@smooth-ui/core-sc';

const StyledSkills = styled.div`
  margin: 30px 0 10px;
`;

const StyledTitle = styled(Typography)`
  margin-bottom: 15px !Important;
`;

const StyledH4 = styled(Typography)`

`;

const StyledParagraph = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  color: #444 !important;
`;

const Skills = () => (
  <StyledSkills className='skills'>
    <StyledTitle variant='h2'>Skills</StyledTitle>
    <Grid>
      <Row>
        <Col>
          <StyledH4 variant='h4' color='#333'>HTML/CSS</StyledH4>
          <StyledParagraph>
            HTML5, CSS3, Sass, Less, Responsive Web Design, Bootstrap, Styled-Components, CSS in JS
          </StyledParagraph>
        </Col>
        <Col>
          <StyledH4 variant='h4' color='#333'>Javascript</StyledH4>
          <StyledParagraph>
            React, Angular, Redux, Redux-Saga, Webpack, Grunt, Gulp
          </StyledParagraph>
        </Col>
      </Row>
      <Row>
        <Col>
          <StyledH4 variant='h4' color='#333'>Back-end</StyledH4>
          <StyledParagraph>
            Node.js, PHP, MySQL, MongoDB, Rest-API
          </StyledParagraph>
        </Col>
        <Col>
          <StyledH4 variant='h4' color='#333'>Dev Tools</StyledH4>
          <StyledParagraph>
            Gulp, Grunt, Webpack, Git, NPM
          </StyledParagraph>
        </Col>
      </Row>
      <Row>
        <Col>
          <StyledH4 variant='h4' color='#333'>UI/UX</StyledH4>
          <StyledParagraph>
            Adobe PS/AI, Sketch, Zeplin, Invision
          </StyledParagraph>
        </Col>
        <Col></Col>
      </Row>
    </Grid>
  </StyledSkills>
);

export default Skills;