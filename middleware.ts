import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Root path: rewrite (not redirect) to default locale.
  // This avoids redirect loops with external proxies (Cloudflare, etc.)
  // while the canonical tag in the layout ensures Google indexes /{locale} not /.
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.rewrite(url);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
