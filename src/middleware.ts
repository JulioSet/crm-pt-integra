// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/session';

export async function middleware(req: NextRequest) {
   const session = await getSession();
   if (!session) {
      return NextResponse.redirect(new URL('/', req.url));
   }
   
   // Role-based access control
   const userRole = session.role;
   const pathname = req.nextUrl.pathname;

   const rolePermissions: Record<string, string[]> = {
      admin: ['/dashboard/messages', '/dashboard/notifications', '/dashboard/contacts', '/dashboard/settings', '/dashboard/agent', '/dashboard/reports'],
      sales: ['/dashboard/messages', '/dashboard/notifications', '/dashboard/contacts'],
      cs: ['/dashboard/messages', '/dashboard/notifications'],
      tech: ['/dashboard/messages', '/dashboard/notifications'],
   };

   // Get all allowed paths for the user role
   const allowedPaths = rolePermissions[userRole as string] || [];

   // Check if the user is allowed to access the requested path
   const isAllowed = allowedPaths.some((path: string) => pathname.startsWith(path));
   if (!isAllowed) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
   }

   return NextResponse.next();
}

// Define the routes to protect
export const config = {
   matcher: [
      '/dashboard/:path*'
   ],
};
