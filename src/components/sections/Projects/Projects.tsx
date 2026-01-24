'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Project } from '@/types/resume';
import styles from './Projects.module.css';

type Props = {
  data: Project[];
};

export function Projects({ data }: Props) {
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
    <MotionSection id="projects" className={styles.projects} {...sectionProps}>
      <div className={styles.container}>
        <MotionDiv {...itemProps}>
          <h2 className={styles.heading}>
            <span className={styles.number}>03.</span> Projects
          </h2>
        </MotionDiv>

        <div className={styles.grid}>
          {data.map((project) => (
            <MotionDiv key={project.id} {...itemProps} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.projectName}>{project.name}</h3>
                {project.status === 'coming-soon' && (
                  <span className={styles.badge}>Coming Soon</span>
                )}
              </div>

              <p className={styles.description}>{project.description}</p>

              <div className={styles.technologies}>
                {project.technologies.map((tech) => (
                  <span key={tech} className={styles.tech}>
                    {tech}
                  </span>
                ))}
              </div>

              <div className={styles.links}>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    GitHub
                  </a>
                )}
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
