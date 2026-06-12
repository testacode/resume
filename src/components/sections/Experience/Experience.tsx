'use client';

import { motion } from 'motion/react';
import { fadeInUp, fadeInLeft, staggerContainer } from '@/lib/animations';
import type { WorkExperience } from '@/types/resume';
import styles from './Experience.module.css';

type Props = {
  data: WorkExperience[];
};

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function Experience({ data }: Props) {
  return (
    <motion.section
      id="experience"
      className={styles.experience}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
    >
      <div className={styles.container}>
        <motion.div variants={fadeInLeft} className={styles.headingGroup}>
          <span className={styles.number}>02</span>
          <h2 className={styles.heading}>Experience</h2>
        </motion.div>

        <div className={styles.timeline}>
          {data.map((job) => (
            <motion.article key={job.id} variants={fadeInUp} className={styles.job}>
              <p className={styles.dates}>
                {formatDate(job.startDate)} — {formatDate(job.endDate)}
              </p>
              <div className={styles.jobContent}>
                <h3 className={styles.jobTitle}>
                  {job.title} <span className={styles.company}>· {job.company}</span>
                </h3>
                {job.isContractor && job.contractorCompany && (
                  <p className={styles.contractor}>via {job.contractorCompany}</p>
                )}
                <p className={styles.description}>{job.description}</p>
                <p className={styles.tech}>{job.technologies.join(' · ')}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
