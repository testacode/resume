import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { resumeData } from '@/data/resume';
import styles from './page.module.css';

export default function Home() {
  const { personal } = resumeData;

  return (
    <main id="main-content" className={styles.main}>
      <div className={styles.header}>
        <ThemeToggle />
      </div>
      <div className={styles.content}>
        <h1>{personal.name}</h1>
        <p className={styles.title}>{personal.title}</p>
        <p className={styles.tagline}>{personal.tagline}</p>
        <p className={styles.status}>Portfolio v2 - Setup Complete</p>
      </div>
    </main>
  );
}
