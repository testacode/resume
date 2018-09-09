import React from 'react';
import styled from 'styled-components';
import { Grid, Row, Col, Typography } from '@smooth-ui/core-sc';

import Item from './Item';

const StyledExperience = styled.div`
  margin: 30px 0 10px;
`;

const StyledTitle = styled(Typography) `
  margin-bottom: 15px !Important;
`;

const Experience = () => (
  <StyledExperience className='experience'>
    <StyledTitle variant='h2'>Experience</StyledTitle>
    <Grid>
      <Row>
        <Col>
          <Item
            className='elementum'
            since='- Since Aug/2017'
            title='Elementum'
            task='Front End Web Developer for UI interface on Data Acquisitions Management team.'
            skills='ReactJS, Webpack, Redux, Redux-Saga, Lodash, Jest/Enzyme, ESLint for readable code.'
            description='Create a React “Single Page Application” Portal for managing clients sensible (Starbucks, OSI Group, Philips, Flex) data right from scratch. The Portal enables the user to upload spreadsheet files that are uploaded to an S3 bucket from Amazon and gets processed by the back-end services. Then returns a feedback file which enables the client to have clear view of the processed results and also enables the user to see the data and the progress of the data processed. For this project I worked on the web interface, app design architecture and usability.' />

          <Item
            className='deloitte'
            since='- Since Feb/2016 - Jul/2017'
            title='Deloitte (*)'
            task='Senior Front End Web Developer for Deloitte.'
            skills='Angular (1.6), Lodash/Underscore, Karma/Jasmine'
            description='Development for a punctual project called “Rmss” (Resource Management Staff Setup). Tool for managing resources, adding skills for resources, etc.' 
            globant />
          
          <Item
            className='thomas-cook'
            since='- Since Dec/2015 - Jan/2016'
            title='Thomas Cook (*)'
            task='Senior Front End Web Developer for Thomas Cook.'
            skills='Angular (1.5), Lodash/Underscore, Karma/Jasmine'
            description='Development for the global page of Thomas Cook (thomascook.com). Lets the user to book flights, hotels, etc. all over Europe'
            globant />

          <Item
            className='thomas-cook'
            since='- Since Dec/2015 - Jan/2016'
            title='Thomas Cook (*)'
            task='Senior Front End Web Developer for Thomas Cook CMS.'
            skills='Angular (1.5), Lodash/Underscore, Karma/Jasmine, Node JS, Magnolia CMS'
            description='Development for a Customized Magnolia CMS used by Product Owners of Thomas Cook that lets users adding content to the dynamic pages of the global site (thomascook.com)'
            globant />

          <Item
            className='wdpro'
            since='- Since Jan/2015 - Dec/2015'
            title='Walt Disney Parks and Resorts (*)'
            task='Senior Web Developer for Disney Cruise Line.'
            skills='Angular (1.3), Less, Karma/Jasmine, Bower, Behat'
            description='Development of the renewed e-commerce site for placing cruise reservations with Disney’s Cruise Line assuring best coding practices and also giving assistance to any newcomer to the project.'
            globant />

          <Item
            className='wdpro'
            since='- Since Aug/2014 - Dec/2014'
            title='Walt Disney Parks and Resorts (*)'
            task='Senior Web Developer for Disney Visa Instant Credit.'
            skills='PHP, Zend Framework, PhpUnit, Vanilla Javascript, jQuery, jBehave'
            description='Development of the also renewed e-commerce site for applying to the Disney Visa Credit Card.'
            globant />

          <Item
            className='wdpro'
            since='- Since May/2014 - Jul/2014'
            title='Walt Disney Parks and Resorts (*)'
            task='Senior Web Developer for Fast Pass Plus (FP+) & Fast Food Plus (FF+).'
            skills='Angular (1.3), Less, Karma/Jasmine, Bower, Behat'
            description='Development of the also renewed e-commerce site for applying to the Disney Visa Credit Card.'
            globant />

          <Item
            className='wdpro'
            since='- Since Dec/2013 - Feb/2014'
            title='Walt Disney Parks and Resorts (*)'
            task='Semi-Senior Web Developer for My Disney Experience Itinerary.'
            skills='Angular (1.3), Less, Karma/Jasmine, Bower, Behat'
            description='Development of the Plan and Share your Disney Vacation Itinerary.'
            globant />

          <Item
            className='wdpro'
            since='- Since Sep/2011 - Nov/2013'
            title='Walt Disney Parks and Resorts (*)'
            task='Semi-Senior Web Developer for My Disney Experience (Responsive).'
            skills='PHP, Zend Framework, PhpUnit, Vanilla Javascript, jQuery, jBehave'
            description='Development of the responsive view for the MDX site.'
            globant />

          <Item
            className='wdpro'
            since='- Since May/2011 - Oct/2011'
            title='Walt Disney Parks and Resorts (*)'
            task='Semi-Senior Web Developer for Disney Online Check In.'
            skills='PHP, Zend Framework, PhpUnit, Vanilla Javascript, jQuery, jBehave'
            description='Development of the Disney Online Check In service that lets the user prepare the checking to any Disney Resort before arriving.'
            globant />

          <Item
            className='wdpro'
            since='- Since Aug/2010 - Feb/2011'
            title='Walt Disney Parks and Resorts (*)'
            task='Semi-Senior Web Developer for My Disney Experience.'
            skills='PHP, Zend Framework, PhpUnit, Vanilla Javascript, jQuery, jBehave'
            description='Development of the new Disney Personal Experience Portal - My Disney Experience (2.0).'
            globant />

          <Item
            className='gameloft'
            since='- Since May/2008 - Jul/2010'
            title='Gameloft'
            task='Webmaster and Community Manager of Gameloft.com (Worldwide).'
            skills='PHP, Vanilla Javascript, jQuery, MySql'
            description='Basic procedural development for publishing press documents, publishing games for all platforms, media coordination with creative department. Here’s where all started for me and software engineering.' />
        </Col>
      </Row>
    </Grid>
  </StyledExperience>
);

export default Experience;