'use client';

import { motion } from 'motion/react';
import { fadeInUp, fadeInLeft, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
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
  const prefersReducedMotion = useReducedMotion();

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
    <MS id="experience" className={styles.experience} {...sectionProps}>
      <div className={styles.container}>
        <M {...headingProps} className={styles.headingGroup}>
          <span className={styles.number}>02</span>
          <h2 className={styles.heading}>Experience</h2>
        </M>

        <div className={styles.timeline}>
          {data.map((job) => (
            <M key={job.id} {...itemProps} className={styles.job}>
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
            </M>
          ))}
        </div>
      </div>
    </MS>
  );
}
