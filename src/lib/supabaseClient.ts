/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Prioritize environment variables, but fall back to the provided credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://hdvcgxpfmtshrlxqpart.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wejxQSTYYmtUc7YQUmkpOA_ZxhkzxDa';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
