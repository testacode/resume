'use client';

import { FaLinkedinIn, FaGithub, FaGitlab, FaInstagram } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import type { SocialLink } from '@/types/resume';
import styles from './SocialLinks.module.css';

type IconName = SocialLink['icon'];

const iconMap: Record<IconName, React.ComponentType<{ size?: number }>> = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  gitlab: FaGitlab,
  instagram: FaInstagram,
  email: HiOutlineMail,
};

type Props = {
  links: SocialLink[];
  size?: 'sm' | 'md' | 'lg';
};

export function SocialLinks({ links, size = 'md' }: Props) {
  const enabledLinks = links.filter((link) => link.enabled);
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <ul className={styles.list} aria-label="Social media links">
      {enabledLinks.map((link) => {
        const Icon = iconMap[link.icon];
        return (
          <li key={link.name}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label={`Visit my ${link.name} profile`}
            >
              <Icon size={iconSize} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
