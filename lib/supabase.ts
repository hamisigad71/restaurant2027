import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ttupffynxhegdszcjriv.supabase.co'
const supabaseAnonKey = 'sb_publishable_-mmypDYyj1EBczFZ7qckBw_cx8OHoEN'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
