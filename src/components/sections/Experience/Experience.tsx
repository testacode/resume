'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { WorkExperience } from '@/types/resume';
import styles from './Experience.module.css';

type Props = {
  data: WorkExperience[];
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function Experience({ data }: Props) {
  const prefersReducedMotion = useReducedMotion();

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
    <MotionSection id="experience" className={styles.experience} {...sectionProps}>
      <div className={styles.container}>
        <MotionDiv {...itemProps}>
          <h2 className={styles.heading}>
            <span className={styles.number}>02.</span> Experience
          </h2>
        </MotionDiv>

        <div className={styles.timeline}>
          {data.map((job) => (
            <MotionDiv key={job.id} {...itemProps} className={styles.job}>
              <div className={styles.jobHeader}>
                <h3 className={styles.jobTitle}>
                  {job.title}
                  <span className={styles.company}> @ {job.company}</span>
                </h3>
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
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
