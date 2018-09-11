import React from 'react';
import { Grid, Row, Col } from '@smooth-ui/core-sc';

import Content from './content';
import Header from './content/Header';
import Paper from './components/Paper';
import Birds from './content/Introduction/Birds';

const App = () => (
  <div className='app'>
    <Birds />
    <Paper width='90rem'>
      <Grid>
        <Row>
          <Col />
          <Col xs={6}>
            <Header />
          </Col>
          <Col />
        </Row>
        <Row justifyContent='center'>
          <Content />
        </Row>
      </Grid>
    </Paper>
  </div>
);

export default App;