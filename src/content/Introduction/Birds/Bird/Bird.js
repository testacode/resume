import React from 'react';
import PropTypes from 'prop-types';

const Bird = ({ className }) => (
  <div className={`bird ${className}`} />
);

Bird.propTypes = {
  className: PropTypes.string
};

Bird.defaultProps = {
  className: null
};

export default Bird;