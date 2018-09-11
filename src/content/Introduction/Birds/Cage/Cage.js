import React from 'react';
import PropTypes from 'prop-types';

const Cage = ({ className, children }) => (
  <div className={`bird-container ${className}`}>
    {children}
  </div>
);

Cage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Cage.defaultProps = {
  className: null
};

export default Cage;