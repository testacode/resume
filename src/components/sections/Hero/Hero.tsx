'use client';

import { motion } from 'motion/react';
import { FiArrowDown } from 'react-icons/fi';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { heroName, heroItem } from '@/lib/animations';
import type { PersonalInfo } from '@/types/resume';
import styles from './Hero.module.css';

type Props = {
  data: PersonalInfo;
};

export function Hero({ data }: Props) {
  const { name, title, tagline, address, social } = data;

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.content}>
        <motion.div initial="hidden" animate="visible" variants={heroItem(0.1)}>
          <p className={styles.greeting}>
            <span className={styles.prompt}>charly@portfolio:~$</span> whoami
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={heroName}>
          <h1 className={styles.name}>{name}</h1>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={heroItem(0.5)}>
          <h2 className={styles.title}>{title}</h2>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={heroItem(0.7)}>
          <p className={styles.tagline}>{tagline}</p>
        </motion.div>

        <motion.div
          className={styles.accentLine}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 1, 0.5, 1] }}
        />

        <motion.div initial="hidden" animate="visible" variants={heroItem(1.0)}>
          <div className={styles.bottom}>
            <SocialLinks links={social} size="lg" />
            <p className={styles.location}>
              {address.city}, {address.country}
            </p>
          </div>
        </motion.div>
      </div>

      <a href="#about" className={styles.scrollDown} aria-label="Scroll to about section">
        <FiArrowDown size={20} />
      </a>
    </section>
  );
}
