import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!session?.userId || !key) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Get user metadata from Clerk
    const response = await fetch(`https://api.clerk.dev/v1/users/${session.userId}/metadata`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user metadata');
    }

    const { public_metadata } = await response.json();
    const data = public_metadata[key];

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching synced data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const { key, data } = await request.json();

  if (!session?.userId || !key) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Update user metadata in Clerk
    const response = await fetch(`https://api.clerk.dev/v1/users/${session.userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          [key]: data,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user metadata');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating synced data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 