import React from 'react';
import { Grid, Row, Col } from '@smooth-ui/core-sc';

import Content from './Content';
import Header from './Content/Header';
import Paper from './components/Paper';
import Birds from './Content/Introduction/Birds';

const App = () => (
  <div className='app'>
    <Birds />
    <Paper width='90rem'>
      <Grid>
        <Row>
          <Col></Col>
          <Col xs={6}>
            <Header />
          </Col>
          <Col></Col>
        </Row>
        <Row justifyContent='center'>
          <Content />
        </Row>
      </Grid>
    </Paper>
  </div>
);

export default App;