import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('access_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = ['/login', '/signup', '/reset-password'].includes(pathname);

  // Authenticated users: redirect away from auth pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Owner-only routes
  const isOwnerRoute = pathname.startsWith('/OwnerDashboard') || pathname.startsWith('/ChooseHotel');
  if (isOwnerRoute) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    if (role !== 'Owner' && role !== 'Admin') return NextResponse.redirect(new URL('/', request.url));
  }

  // Admin-only routes
  const isAdminRoute = pathname.startsWith('/role');
  if (isAdminRoute) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    if (role !== 'Admin') return NextResponse.redirect(new URL('/', request.url));
  }

  // Dashboard routes: require authentication
  if (pathname.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/profile/:path*',
    '/OwnerDashboard/:path*',
    '/ChooseHotel/:path*',
    '/role/:path*',
  ],
};
