'use client';

import { motion } from 'motion/react';
import { FiDownload } from 'react-icons/fi';
import { FaLinkedinIn } from 'react-icons/fa';
import { fadeInUp, fadeInLeft, staggerContainer } from '@/lib/animations';
import type { PersonalInfo } from '@/types/resume';
import styles from './About.module.css';

type Props = {
  data: PersonalInfo;
};

export function About({ data }: Props) {
  const { name, bio, address, social, resumePdfUrl, resumeDocxUrl } = data;
  const linkedin = social.find((s) => s.icon === 'linkedin' && s.enabled);

  return (
    <motion.section
      id="about"
      className={styles.about}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
    >
      <div className={styles.container}>
        <motion.div variants={fadeInLeft} className={styles.headingGroup}>
          <span className={styles.number}>01</span>
          <h2 className={styles.heading}>About Me</h2>
        </motion.div>

        <div className={styles.content}>
          <motion.div variants={fadeInUp} className={styles.bio}>
            <p>{bio}</p>
          </motion.div>

          <motion.div variants={fadeInUp} className={styles.details}>
            <div className={styles.info}>
              <h3>Contact</h3>
              <p>{name}</p>
              <p>
                {address.city}, {address.country}
              </p>
              {linkedin && (
                <a
                  href={linkedin.url}
                  className={styles.contactButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get in touch with me on LinkedIn"
                >
                  <FaLinkedinIn size={14} aria-hidden="true" />
                  Get in touch <span aria-hidden="true">→</span>
                </a>
              )}
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
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
