import React from 'react';
import { chunk, uniqueId } from 'lodash';
import styled from 'styled-components';

import { Grid, Row, Col, Typography } from '@smooth-ui/core-sc';
import data from '../../info.json';

const { sections: { skills } } = data;

const StyledSkills = styled.div`
  margin: 30px 0 10px;
`;

const StyledTitle = styled(Typography)`
  margin-bottom: 15px !Important;
`;

const StyledParagraph = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  color: #444 !important;
`;

const Skills = () => (
  <StyledSkills className='skills'>
    <StyledTitle variant='h2'>{skills.title}</StyledTitle>
    <Grid>
      {chunk(skills.items, 2).map(group => (
        <Row key={uniqueId()}>
          {group.map(item => (
            <Col key={item.title}>
              <Typography variant='h4' color='#333'>{item.title}</Typography>
              <StyledParagraph>
                {item.skills}
              </StyledParagraph>
            </Col>
          ))}
        </Row>
      ))}
    </Grid>
  </StyledSkills>
);

export default Skills;