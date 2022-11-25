// Create a single supabase client for interacting with your database
import { createClient } from "@supabase/supabase-js"

const url = process.env["SUPABASE_URL"]!
const anonKey = process.env["SUPABASE_ANON_KEY"]!

export const Supabase = createClient(url, anonKey)
