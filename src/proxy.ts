import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!_next|mcp|.*\\..*).*)', '/(api|trpc)(.*)'],
};
