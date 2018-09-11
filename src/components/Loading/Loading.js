/**
 * Got it from https://codepen.io/matchboxhero/pen/bomWGK?editors=1100
 */
import React from 'react';
import styled from 'styled-components';

const StyledLoading = styled.div`
  display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
  width: 100%;
  position: absolute;
  top:0;

  .loader {
    z-index: 10;
    max-width: 15rem;
    width: 100%;
    height: auto;
    stroke-linecap: round;
  }

  circle {
    fill: none;
    stroke-width: 3.5;
    animation-name: preloader;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    transform-origin: 170px 170px;
    will-change: transform;

    &:nth-of-type(1) {
      stroke-dasharray: 550px;
    }

    &:nth-of-type(2) {
      stroke-dasharray: 500px;
    }

    &:nth-of-type(3) {
      stroke-dasharray: 450px;
    }

    &:nth-of-type(4) {
      stroke-dasharray: 300px;
    }

    @for $i from 1 through 4 {
      &:nth-of-type(#{$i}) {
        animation-delay: -#{$i * 0.15}s;
      }
    }
  }

  @keyframes preloader {
    50% {
      transform: rotate(360deg);
    }
  }

`;

const BluredBg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  filter: blur(0.3rem);
  background-color: #858577;
  background-image: url("https://www.transparenttextures.com/patterns/bright-squares.png");
`;

const Loading = (props) => console.log('props', props) || (
  <StyledLoading className='loading'>
    <BluredBg />
    <svg className="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340">
      <circle cx="170" cy="170" r="160" stroke="#E2007C" />
      <circle cx="170" cy="170" r="135" stroke="#404041" />
      <circle cx="170" cy="170" r="110" stroke="#E2007C" />
      <circle cx="170" cy="170" r="85" stroke="#404041" />
    </svg>
  </StyledLoading>
);

export default Loading;