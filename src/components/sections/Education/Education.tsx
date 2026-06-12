'use client';

import { motion } from 'motion/react';
import { fadeInUp, fadeInLeft, staggerContainer } from '@/lib/animations';
import type { Education as EducationType } from '@/types/resume';
import styles from './Education.module.css';

type Props = {
  data: EducationType[];
};

export function Education({ data }: Props) {
  return (
    <motion.section
      id="education"
      className={styles.education}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
    >
      <div className={styles.container}>
        <motion.div variants={fadeInLeft} className={styles.headingGroup}>
          <span className={styles.number}>04</span>
          <h2 className={styles.heading}>Education</h2>
        </motion.div>

        <div className={styles.list}>
          {data.map((entry) => (
            <motion.article key={entry.school} variants={fadeInUp} className={styles.entry}>
              <p className={styles.date}>{entry.graduationDate}</p>
              <div className={styles.entryContent}>
                <h3 className={styles.school}>{entry.school}</h3>
                <p className={styles.degree}>{entry.degree}</p>
                {entry.description && <p className={styles.description}>{entry.description}</p>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
