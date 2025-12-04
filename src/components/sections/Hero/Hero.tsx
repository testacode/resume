'use client';

import { motion } from 'motion/react';
import { FiArrowDown } from 'react-icons/fi';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PersonalInfo } from '@/types/resume';
import styles from './Hero.module.css';

type Props = {
  data: PersonalInfo;
};

export function Hero({ data }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { name, title, tagline, address, social } = data;

  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;
  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: staggerContainer,
      };

  const itemProps = prefersReducedMotion ? {} : { variants: fadeInUp };

  return (
    <section id="home" className={styles.hero}>
      <MotionDiv className={styles.content} {...motionProps}>
        <MotionDiv {...itemProps}>
          <p className={styles.greeting}>Hello, I&apos;m</p>
        </MotionDiv>

        <MotionDiv {...itemProps}>
          <h1 className={styles.name}>{name}</h1>
        </MotionDiv>

        <MotionDiv {...itemProps}>
          <h2 className={styles.title}>{title}</h2>
        </MotionDiv>

        <MotionDiv {...itemProps}>
          <p className={styles.tagline}>{tagline}</p>
        </MotionDiv>

        <MotionDiv {...itemProps}>
          <p className={styles.location}>
            Based in {address.city}, {address.country}
          </p>
        </MotionDiv>

        <MotionDiv {...itemProps} className={styles.social}>
          <SocialLinks links={social} size="lg" />
        </MotionDiv>
      </MotionDiv>

      <a href="#about" className={styles.scrollDown} aria-label="Scroll to about section">
        <FiArrowDown size={24} />
      </a>
    </section>
  );
}
