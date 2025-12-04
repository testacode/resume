import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Redirect apex domain to www
  if (host === 'xmontc.xyz') {
    const url = request.nextUrl.clone();
    url.host = 'www.xmontc.xyz';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
