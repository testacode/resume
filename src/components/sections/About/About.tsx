'use client';

import { motion } from 'motion/react';
import { FiDownload } from 'react-icons/fi';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PersonalInfo } from '@/types/resume';
import styles from './About.module.css';

type Props = {
  data: PersonalInfo;
};

export function About({ data }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { name, bio, address, resumePdfUrl, resumeDocxUrl } = data;

  const MotionSection = prefersReducedMotion ? 'section' : motion.section;
  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;

  const sectionProps = prefersReducedMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-100px' },
        variants: staggerContainer,
      };

  const itemProps = prefersReducedMotion ? {} : { variants: fadeInUp };

  return (
    <MotionSection id="about" className={styles.about} {...sectionProps}>
      <div className={styles.container}>
        <MotionDiv {...itemProps}>
          <h2 className={styles.heading}>
            <span className={styles.number}>01.</span> About Me
          </h2>
        </MotionDiv>

        <div className={styles.content}>
          <MotionDiv {...itemProps} className={styles.bio}>
            <p>{bio}</p>
          </MotionDiv>

          <MotionDiv {...itemProps} className={styles.details}>
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
                  <FiDownload size={16} />
                  PDF
                </a>
                <a
                  href={resumeDocxUrl}
                  className={styles.downloadButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download my resume in Word format"
                >
                  <FiDownload size={16} />
                  DOCX
                </a>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}
