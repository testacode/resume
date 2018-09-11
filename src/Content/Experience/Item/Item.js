import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledItem = styled.div`
  width: 100%;
  margin: 0 0 25px;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
`;

const StyledImg = styled.div`
`;

const Since = styled.div`
  font-size: 1.2rem;
  color: grey;
  margin-left: 10px;
`;

const Title = styled.div`
  font-weight: bold;
`;

const Task = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
`;

const Skills = styled.div`
  font-size: 1.4rem;
  color: black;
  font-style: italic;
`;

const Description = styled.q`
  display: block;
  margin: 20px 0 0;
  font-size: 1.4rem;
  text-align: justify;
  color: #444;
  padding: 15px
  background: #eee;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const Contractor = styled.div`
  margin-top: 5px;
  font-weight: bold;
  font-size: 1.2rem;
  color: black;
  text-align: right;
`;

const Item = ({ className, since, title, task, skills, description, globant }) => (
  <StyledItem className='item'>
    <StyledImg className={`logo ${className}`} />
    <StyledWrapper>
      <Title>{title}</Title>
      <Since>{since}</Since>
    </StyledWrapper>
    <Task>{task}</Task>
    <Skills>{skills}</Skills>
    <Description>{description}</Description>
    {globant && <Contractor>* Globant Contractor</Contractor>}
  </StyledItem>
);

Item.propTypes = {
  className: PropTypes.string,
  since: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  task: PropTypes.string.isRequired,
  skills: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  globant: PropTypes.bool,
};

Item.defaultProps = {
  className: null,
  globant: false
};

export default Item;