import { resumeData } from '@/data/resume';
import { SITE_URL } from '@/config/site';
import type { ResumeData } from '@/types/resume';

const year = (date: string | null) => (date ? date.slice(0, 4) : 'Present');

export function buildLlmsTxt(data: ResumeData = resumeData): string {
  const { personal, experience, projects } = data;
  const social = personal.social.filter((s) => s.enabled);
  const live = projects.filter((p) => p.status === 'live');

  return [
    `# ${personal.name} - Portfolio`,
    '',
    '## About',
    `${personal.title} based in ${personal.address.city}, ${personal.address.country}.`,
    personal.bio,
    '',
    '## Contact',
    ...social.map((s) => `- ${s.name}: ${s.url}`),
    '',
    '## Experience',
    ...experience.map(
      (e) =>
        `- ${e.title} at ${e.company}${e.contractorCompany ? ` (via ${e.contractorCompany})` : ''} (${year(e.startDate)} - ${year(e.endDate)}): ${e.description}`
    ),
    '',
    '## Projects',
    ...live.map((p) => `- ${p.name}: ${p.description}${p.url ? ` ${p.url}` : ''}`),
    '',
    '## CV Download',
    `${SITE_URL}${personal.resumePdfUrl}`,
    '',
  ].join('\n');
}
