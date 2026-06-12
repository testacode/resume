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
            <motion.div key={job.id} variants={fadeInUp} className={styles.job}>
              <div className={styles.dot} />
              <div className={styles.jobContent}>
                <div className={styles.jobHeader}>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <p className={styles.company}>@ {job.company}</p>
                  <p className={styles.dates}>
                    {formatDate(job.startDate)} — {formatDate(job.endDate)}
                  </p>
                  {job.isContractor && job.contractorCompany && (
                    <p className={styles.contractor}>via {job.contractorCompany}</p>
                  )}
                </div>

                <p className={styles.description}>{job.description}</p>

                <div className={styles.technologies}>
                  {job.technologies.map((tech) => (
                    <span key={tech} className={styles.tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
