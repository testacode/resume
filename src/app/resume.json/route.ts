import { resumeData } from '@/data/resume';

// Single source of truth for other surfaces (npx xmontc, LinkedIn copy).
export const dynamic = 'force-static';

export function GET() {
  return Response.json(resumeData);
}
