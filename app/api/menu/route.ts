import { NextResponse } from 'next/server';
import { allMenuItems } from '@/lib/menu-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(allMenuItems);
}
