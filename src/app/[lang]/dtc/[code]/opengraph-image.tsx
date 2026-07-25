import { ImageResponse } from 'next/og';
import { getDtcByCode } from '@/lib/dtcData';

export const runtime = 'edge';
export const alt = 'DTC fault code';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ lang: string; code: string }> }) {
  const { code } = await params;
  const codeUpper = code.toUpperCase();
  const dtc = getDtcByCode(codeUpper);
  const description = dtc?.description ?? 'Diagnostic Trouble Code';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#f4b400', fontWeight: 700, marginBottom: 16 }}>
          Auto Fix Data
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: 4, marginBottom: 24 }}>
          {codeUpper}
        </div>
        <div style={{ fontSize: 32, lineHeight: 1.4, maxWidth: 900, opacity: 0.95 }}>
          {description.length > 90 ? `${description.slice(0, 87)}…` : description}
        </div>
      </div>
    ),
    { ...size }
  );
}
