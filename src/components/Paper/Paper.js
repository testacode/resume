/**
 * Got it from: https://css-tricks.com/snippets/css/stack-of-paper/
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledPaper = styled.div`
  &.paper {
    z-index: 10;
    width: ${props => props.width};
    background: #fff;
    padding: 30px 30px 50px;
    position: relative;
  }

  &.paper,
  &.paper::before,
  &.paper::after {
    /* Styles to distinguish sheets from one another */
    box-shadow: 1px 1px 1px rgba(0,0,0,0.25);
    border: 1px solid #bbb;
  }

  &.paper::before,
  &.paper::after {
    content: "";
    position: absolute;
    height: 99%;
    width: 99%;
    background-color: #eee;
  }

  &.paper::before {
    right: 15px;
    top: 0;
    transform: rotate(-0.5deg);
    z-index: -1;
  }

  &.paper::after {
    top: 5px;
    right: -5px;
    transform: rotate(0.5deg);
    z-index: -2;
  }
`;

const Paper = ({ children, width }) => (
  <StyledPaper 
    width={width}
    className='paper'>
    {children}
  </StyledPaper>
);

Paper.propTypes = { 
  children: PropTypes.node.isRequired,
  width: PropTypes.string
};

Paper.defaultProps = {
  width: 'inherit'
};

export default Paper;