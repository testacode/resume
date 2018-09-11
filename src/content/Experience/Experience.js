import React from 'react';
import { uniqueId, kebabCase } from 'lodash';
import styled from 'styled-components';

import { Grid, Row, Typography } from '@smooth-ui/core-sc';
import Item from './Item';
import data from '../../info.json';

const StyledExperience = styled.div`
  margin: 30px 0 10px;
`;

const StyledTitle = styled(Typography) `
  margin-bottom: 15px !Important;
`;

const { experience } = data.sections;

const Experience = () => (
  <StyledExperience className='experience'>
    <StyledTitle variant='h2'>{experience.title}</StyledTitle>
    <Grid>
      <Row>
        {experience.items.map(item => (
          <Item
            key={uniqueId()}
            className={kebabCase(item.name)}
            since={item.since}
            title={item.name}
            task={item.position}
            skills={item.technology}
            description={item.description} 
            contractor={item.contractor} />
        ))}
      </Row>
    </Grid>
  </StyledExperience>
);

export default Experience;