import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import the Supabase client

interface SupabaseData {
  [key: string]: unknown;
}

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key'); // This key will now correspond to the column name in Supabase

  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
  }

  try {
    // Fetch data from Supabase for the specific user and key
    console.log(`Fetching data from Supabase for user ${session.userId}, key: ${key}`);

    const { data, error } = await supabase
      .from('user_data') // Your Supabase table name
      .select(key)       // Select the specific column
      .eq('user_id', session.userId) // Filter by Clerk user ID
      .single(); // Expecting a single row

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (which is okay if it's a new user)
      console.error('Error fetching data from Supabase:', error);
      throw new Error('Failed to fetch data from Supabase');
    }

    // Return the value of the specific key, or null if no data was found
    return NextResponse.json(((data as unknown) as SupabaseData)?.[key] || null);

  } catch (error) {
    console.error('Error in GET /api/sync:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key, data } = await req.json();

    if (!key || data === undefined) {
      return NextResponse.json({ error: 'Missing key or data in request body' }, { status: 400 });
    }

    // Prepare data object for upsert
    const updateData = {
        user_id: session.userId,
        [key]: data
    };

    // Upsert data into Supabase (insert if user_id doesn't exist, update if it does)
    console.log(`Upserting data into Supabase for user ${session.userId}, key: ${key}`);
    console.log('Upsert data:', JSON.stringify(updateData));

    const { error } = await supabase
      .from('user_data') // Your Supabase table name
      .upsert([updateData], { // Upsert based on user_id
          onConflict: 'user_id'
      });

    if (error) {
      console.error('Error upserting data into Supabase:', error);
      throw new Error('Failed to upsert data into Supabase');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in POST /api/sync:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 