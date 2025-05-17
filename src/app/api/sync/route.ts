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

    // For goalsAchieved, we need to use the correct column name
    const columnName = key === 'goalsAchieved' ? 'goals_achieved' : key;

    const { data, error } = await supabase
      .from('user_data') // Your Supabase table name
      .select(columnName)       // Select the specific column
      .eq('user_id', session.userId) // Filter by Clerk user ID
      .single(); // Expecting a single row

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (which is okay if it's a new user)
      console.error('Error fetching data from Supabase:', error);
      throw new Error('Failed to fetch data from Supabase');
    }

    // For goalsAchieved, we need to map the column name back
    if (key === 'goalsAchieved') {
      const typedData = data as unknown as { goals_achieved: number } | null;
      return NextResponse.json(typedData?.goals_achieved || 0);
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

    // First, get the current data for the user
    const columnName = key === 'goalsAchieved' ? 'goals_achieved' : key;
    const { data: currentData, error: fetchError } = await supabase
      .from('user_data')
      .select(columnName)
      .eq('user_id', session.userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching current data:', fetchError);
      throw new Error('Failed to fetch current data');
    }

    // Prepare the update data
    let updateData;
    if (key === 'meals') {
      // For meals, we need to handle the array properly
      const currentMeals = currentData?.[columnName] || [];
      // Ensure we're not duplicating meals
      const newMeals = Array.isArray(data) ? data : [...currentMeals, data];
      console.log('Current meals:', currentMeals);
      console.log('New meals:', newMeals);
      
      updateData = {
        user_id: session.userId,
        [columnName]: newMeals
      };
    } else {
      // For other fields, just update directly
      updateData = {
        user_id: session.userId,
        [columnName]: data
      };
    }

    console.log(`Upserting data into Supabase for user ${session.userId}, key: ${columnName}`);
    console.log('Upsert data:', JSON.stringify(updateData, null, 2));

    // Try to insert first
    const { error: insertError } = await supabase
      .from('user_data')
      .upsert([updateData], {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });

    if (insertError) {
      console.error('Error upserting data in Supabase:', insertError);
      throw new Error(`Failed to upsert data in Supabase: ${insertError.message}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in POST /api/sync:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 