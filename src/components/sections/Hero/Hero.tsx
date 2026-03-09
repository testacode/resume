'use client';

import { motion } from 'motion/react';
import { FiArrowDown } from 'react-icons/fi';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { heroName, heroItem } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PersonalInfo } from '@/types/resume';
import styles from './Hero.module.css';

type Props = {
  data: PersonalInfo;
};

export function Hero({ data }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { name, title, tagline, address, social } = data;

  const M = prefersReducedMotion ? 'div' : motion.div;
  const noMotion = prefersReducedMotion;

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.content}>
        <M {...(noMotion ? {} : { initial: 'hidden', animate: 'visible', variants: heroItem(0.1) })}>
          <p className={styles.greeting}>Hello, I&apos;m</p>
        </M>

        <M {...(noMotion ? {} : { initial: 'hidden', animate: 'visible', variants: heroName })}>
          <h1 className={styles.name}>{name}</h1>
        </M>

        <M {...(noMotion ? {} : { initial: 'hidden', animate: 'visible', variants: heroItem(0.5) })}>
          <h2 className={styles.title}>{title}</h2>
        </M>

        <M {...(noMotion ? {} : { initial: 'hidden', animate: 'visible', variants: heroItem(0.7) })}>
          <p className={styles.tagline}>{tagline}</p>
        </M>

        <M
          className={styles.accentLine}
          {...(noMotion ? {} : {
            initial: { scaleX: 0, opacity: 0 },
            animate: { scaleX: 1, opacity: 1 },
            transition: { duration: 0.6, delay: 0.9, ease: [0.25, 1, 0.5, 1] },
          })}
        />

        <M {...(noMotion ? {} : { initial: 'hidden', animate: 'visible', variants: heroItem(1.0) })}>
          <div className={styles.bottom}>
            <SocialLinks links={social} size="lg" />
            <p className={styles.location}>
              {address.city}, {address.country}
            </p>
          </div>
        </M>
      </div>

      <a href="#about" className={styles.scrollDown} aria-label="Scroll to about section">
        <FiArrowDown size={20} />
      </a>
    </section>
  );
}
