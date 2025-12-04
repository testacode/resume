import { SocialLinks } from '@/components/ui/SocialLinks';
import type { SocialLink } from '@/types/resume';
import styles from './Footer.module.css';

type Props = {
  social: SocialLink[];
  name: string;
};

export function Footer({ social, name }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <SocialLinks links={social} size="sm" />
        <p className={styles.copyright}>
          © {currentYear} {name}. Built with Next.js
        </p>
      </div>
    </footer>
  );
}
