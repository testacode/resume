import { SocialLinks } from '@/components/ui/SocialLinks';
import type { SocialLink } from '@/types/resume';
import styles from './Footer.module.css';

type Props = {
  social: SocialLink[];
  name: string;
};

export function Footer({ social, name }: Props) {
  const currentYear = new Date().getFullYear();
  const buildInfo = 'v2.0.0 · next 16 · cloudflare workers · npx xmontc';

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <SocialLinks links={social} size="sm" />
        <p className={styles.copyright}>
          <span className={styles.build}>{buildInfo}</span>
          © {currentYear} {name}
        </p>
      </div>
    </footer>
  );
}
