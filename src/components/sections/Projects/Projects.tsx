'use client';

import { motion } from 'motion/react';
import { scaleIn, fadeInLeft, staggerContainer } from '@/lib/animations';
import type { Project } from '@/types/resume';
import styles from './Projects.module.css';

type Props = {
  data: Project[];
};

export function Projects({ data }: Props) {
  return (
    <motion.section
      id="projects"
      className={styles.projects}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
    >
      <div className={styles.container}>
        <motion.div variants={fadeInLeft} className={styles.headingGroup}>
          <span className={styles.number}>03</span>
          <h2 className={styles.heading}>Projects</h2>
        </motion.div>

        <div className={styles.grid}>
          {data.map((project) => (
            <motion.div key={project.id} variants={scaleIn} className={styles.card}>
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
                    aria-label={`View ${project.name} demo`}
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
                    aria-label={`View ${project.name} on GitHub`}
                  >
                    GitHub
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
