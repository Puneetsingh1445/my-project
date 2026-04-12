import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MoodEntry {
  id?: string;
  user_id: string;
  mood: string;
  note: string;
  created_at?: string;
}

export interface MoodResult {
  success: boolean;
  data?: MoodEntry;
  error?: string;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateMoodInput(user_id: string, mood: string, note: string): string | null {
  if (!user_id || user_id.trim() === '') return 'user_id is required.';
  if (!mood || mood.trim() === '') return 'Mood cannot be empty.';
  if (mood.trim().length > 100) return 'Mood value is too long (max 100 characters).';
  if (note && note.length > 2000) return 'Note is too long (max 2000 characters).';
  return null;
}

// ── Core Functions ────────────────────────────────────────────────────────────

/**
 * Insert a new mood entry into the Supabase `moods` table.
 *
 * @param user_id  - The authenticated user's ID (UUID or string)
 * @param mood     - The mood label (e.g. "Happy", "Sad") — required
 * @param note     - Optional journal note / free-text entry
 * @returns        MoodResult with success flag, inserted data, or error message
 */
export async function addMood(
  user_id: string,
  mood: string,
  note: string = ''
): Promise<MoodResult> {
  // 1. Validate inputs
  const validationError = validateMoodInput(user_id, mood, note);
  if (validationError) {
    return { success: false, error: validationError };
  }

  // 2. Guard: Supabase client must be initialised
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase is not configured. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.',
    };
  }

  // 3. Insert into `moods` table
  const { data, error } = await supabase
    .from('moods')
    .insert([{ user_id: user_id.trim(), mood: mood.trim(), note: note.trim() }])
    .select()
    .single();

  if (error) {
    console.error('[addMood] Supabase insert error:', error);
    return {
      success: false,
      error: error.message ?? 'Failed to save mood. Please try again.',
    };
  }

  return { success: true, data: data as MoodEntry };
}

/**
 * Fetch all mood entries for a given user, ordered newest-first.
 *
 * @param user_id - The user's ID to filter by
 * @param limit   - Maximum number of rows to return (default 50)
 */
export async function getMoods(
  user_id: string,
  limit = 50
): Promise<{ success: boolean; data?: MoodEntry[]; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase not configured.' };

  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getMoods] Supabase select error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as MoodEntry[] };
}
