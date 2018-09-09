/**
 * Got it from https://fournier-pere-fils.com/home
 */
import React from 'react';
import styled from 'styled-components';

import Cage from './Cage';
import Bird from './Bird';

const StyledWrapper = styled.div`
  width: 100%;
  position: absolute;
  left: 0;

  .container {
    z-index: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 26rem;
    padding: 2rem;
  }

  .bird {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells.svg);
    background-size: auto 100%;
    width: 88px;
    height: 125px;
    will-change: background-position;
    
    animation-name: fly-cycle;
    animation-timing-function: steps(10);
    animation-iteration-count: infinite;

    &--one {
      animation-duration: 1s;
      animation-delay: -0.5s;		
    }
    
    &--two {
      animation-duration: 0.9s;
      animation-delay: -0.75s;
    }
    
    &--three {
      animation-duration: 1.25s;
      animation-delay: -0.25s;
    }
    
    &--four {
      animation-duration: 1.1s;
      animation-delay: -0.5s;
    }

  }

  .bird-container {
    position: absolute;
    top: 20%;
    left: -10%;
    transform: scale(0) translateX(-10vw);
    will-change: transform;
    
    animation-name: fly-right-one;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    
    &--one {
      animation-duration: 15s;
      animation-delay: 0;
    }
    
    &--two {
      animation-duration: 16s;
      animation-delay: 1s;
    }
    
    &--three {
      animation-duration: 14.6s;
      animation-delay: 9.5s;
    }
    
    &--four {
      animation-duration: 16s;
      animation-delay: 10.25s;
    }
    
  }

  @keyframes fly-cycle {
    
    100% {
      background-position: -900px 0;
    }
    
  }

  @keyframes fly-right-one {
    
    0% {
      transform: scale(0.3) translateX(-10vw);
    }
    
    10% {
      transform: translateY(2vh) translateX(10vw) scale(0.4);
    }
    
    20% {
      transform: translateY(0vh) translateX(30vw) scale(0.5);
    }
    
    30% {
      transform: translateY(4vh) translateX(50vw) scale(0.6);
    }
    
    40% {
      transform: translateY(2vh) translateX(70vw) scale(0.6);
    }
    
    50% {
      transform: translateY(0vh) translateX(90vw) scale(0.6);
    }
    
    60% {
      transform: translateY(0vh) translateX(110vw) scale(0.6);
    }
    
    100% {
      transform: translateY(0vh) translateX(110vw) scale(0.6);
    }
    
  }

  @keyframes fly-right-two {
    
    0% {
      transform: translateY(-2vh) translateX(-10vw) scale(0.5);
    }
    
    10% {
      transform: translateY(0vh) translateX(10vw) scale(0.4);
    }
    
    20% {
      transform: translateY(-4vh) translateX(30vw) scale(0.6);
    }
    
    30% {
      transform: translateY(1vh) translateX(50vw) scale(0.45);
    }
    
    40% {
      transform: translateY(-2.5vh) translateX(70vw) scale(0.5);
    }
    
    50% {
      transform: translateY(0vh) translateX(90vw) scale(0.45);
    }
    
    51% {
      transform: translateY(0vh) translateX(110vw) scale(0.45);
    }
    
    100% {
      transform: translateY(0vh) translateX(110vw) scale(0.45);
    }
    
  }
`;

const Birds = () => (
  <StyledWrapper>
    <div className="container">
      <Cage className="bird-container--one">
        <Bird className="bird--one" />
      </Cage>

      <Cage className="bird-container--two">
        <Bird className="bird--two" />
      </Cage>

      <Cage className="bird-container--three">
        <Bird className="bird--three" />
      </Cage>

      <Cage className="bird-container--four">
        <Bird className="bird--four" />
      </Cage>
    </div>
  </StyledWrapper>
);

export default Birds;