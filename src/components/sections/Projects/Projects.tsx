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

        <div className={styles.list}>
          {data.map((project) => (
            <motion.article key={project.id} variants={scaleIn} className={styles.row}>
              <div className={styles.main}>
                <h3 className={styles.projectName}>
                  {project.name}
                  {project.status === 'coming-soon' && (
                    <span className={styles.soon}>coming soon</span>
                  )}
                </h3>
                <p className={styles.description}>{project.description}</p>
                <div className={styles.links}>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.link}
                       aria-label={`View ${project.name} demo`}>
                      Demo <span aria-hidden="true">→</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.link}
                       aria-label={`View ${project.name} on GitHub`}>
                      GitHub <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </div>
              <p className={styles.tech}>{project.technologies.join(' · ')}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
