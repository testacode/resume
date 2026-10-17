import { ImageResponse } from 'next/og';
import { resumeData } from '@/data/resume';

export const alt = `${resumeData.personal.name} — ${resumeData.personal.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const { name, title } = resumeData.personal;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#1a2322',
        }}
      >
        <div style={{ fontSize: 28, color: '#5fd4c0', letterSpacing: 4, textTransform: 'uppercase' }}>
          Hello, I&apos;m
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, color: '#f2f5f4', marginTop: 16 }}>{name}</div>
        <div style={{ fontSize: 40, color: '#9fb0ad', marginTop: 12 }}>{title}</div>
        <div style={{ width: 120, height: 4, backgroundColor: '#5fd4c0', marginTop: 40 }} />
      </div>
    ),
    size
  );
}
