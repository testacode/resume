import React from 'react';
import { uniqueId, kebabCase } from 'lodash';
import styled from 'styled-components';
import { Grid, Row, Typography } from '@smooth-ui/core-sc';
import data from '../../info.json';

import Item from './Item';

const StyledExperience = styled.div`
  margin: 30px 0 10px;
`;

const StyledTitle = styled(Typography) `
  margin-bottom: 15px !Important;
`;

const Experience = () => (
  <StyledExperience className='experience'>
    <StyledTitle variant='h2'>{data.sections.experience.title}</StyledTitle>
    <Grid>
      <Row>
        {data.sections.experience.items.map(item => (
          <Item
            key={uniqueId()}
            className={kebabCase(item.name)}
            since={`- ${item.since}`}
            title={item.name}
            task={item.position}
            skills={item.technology}
            description={item.description} />
        ))}

      </Row>
    </Grid>
  </StyledExperience>
);

export default Experience;