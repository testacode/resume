'use client';

import { motion } from 'motion/react';
import { FiDownload } from 'react-icons/fi';
import { fadeInUp, fadeInLeft, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PersonalInfo } from '@/types/resume';
import styles from './About.module.css';

type Props = {
  data: PersonalInfo;
};

export function About({ data }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { name, bio, address, resumePdfUrl, resumeDocxUrl } = data;

  const MS = prefersReducedMotion ? 'section' : motion.section;
  const M = prefersReducedMotion ? 'div' : motion.div;

  const sectionProps = prefersReducedMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-100px' },
        variants: staggerContainer,
      };

  const itemProps = prefersReducedMotion ? {} : { variants: fadeInUp };
  const headingProps = prefersReducedMotion ? {} : { variants: fadeInLeft };

  return (
    <MS id="about" className={styles.about} {...sectionProps}>
      <div className={styles.container}>
        <M {...headingProps} className={styles.headingGroup}>
          <span className={styles.number}>01</span>
          <h2 className={styles.heading}>About Me</h2>
        </M>

        <div className={styles.content}>
          <M {...itemProps} className={styles.bio}>
            <p>{bio}</p>
          </M>

          <M {...itemProps} className={styles.details}>
            <div className={styles.info}>
              <h3>Contact</h3>
              <p>{name}</p>
              <p>
                {address.city}, {address.country}
              </p>
            </div>

            <div className={styles.downloadSection}>
              <h3>Resume</h3>
              <div className={styles.downloadButtons}>
                <a
                  href={resumePdfUrl}
                  className={styles.downloadButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download my resume in PDF format"
                >
                  <FiDownload size={16} aria-hidden="true" />
                  PDF
                </a>
                <a
                  href={resumeDocxUrl}
                  className={styles.downloadButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download my resume in Word format"
                >
                  <FiDownload size={16} aria-hidden="true" />
                  DOCX
                </a>
              </div>
            </div>
          </M>
        </div>
      </div>
    </MS>
  );
}
