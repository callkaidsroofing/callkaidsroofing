import os
import shutil

ROOT_DIR = "."
ARCHIVED_DIR = "_archived"

# --- 1. THE GOLDEN UTILS CONTENT ---
UTILS_CONTENT = """import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Standard AUD Currency Formatter
 * Usage: formatCurrency(1500) -> "$1,500.00"
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount)
}

/**
 * Standard Date Formatter
 * Usage: formatDate(new Date()) -> "12 Nov 2025"
 */
export function formatDate(date: Date | string | number) {
  return new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
"""

# --- 2. THE GOLDEN SUPABASE CLIENT ---
SUPABASE_CLIENT_CONTENT = """import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ FATAL: Missing Supabase Environment Variables")
}

// The Single Source of Truth for the Frontend Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
"""

def clean_archived_duplicates():
    print("🧹 Scanning for 'Ghost Files' in _archived folders...")
    deleted_count = 0
    
    for root, dirs, files in os.walk(ROOT_DIR):
        if "_archived" in root:
            # We are inside an archive folder.
            # Check if these files exist in the 'live' parent folders
            for file in files:
                archived_path = os.path.join(root, file)
                
                # Construct logical 'active' path (removing _archived from path)
                # This is a heuristic: src/components/_archived/X -> src/components/X
                active_path = root.replace("_archived", "").replace("//", "/")
                active_file_path = os.path.join(active_path, file)
                
                # Clean up path formatting
                active_file_path = os.path.normpath(active_file_path)

                if os.path.exists(active_file_path):
                    print(f"   🔥 Deleting Duplicate: {archived_path}")
                    print(f"      (Active version exists at: {active_file_path})")
                    os.remove(archived_path)
                    deleted_count += 1
    
    print(f"✅ Deleted {deleted_count} ghost files.")

def create_golden_files():
    print("\n🔨 Building Golden Source Files...")
    
    # Ensure directories exist
    os.makedirs("src/lib", exist_ok=True)
    
    # 1. Utils
    utils_path = "src/lib/utils.ts"
    if not os.path.exists(utils_path):
        with open(utils_path, "w") as f:
            f.write(UTILS_CONTENT)
        print("   ✅ Created src/lib/utils.ts")
    else:
        print("   ⚠️  src/lib/utils.ts already exists. (Skipped overwrite)")

    # 2. Supabase Client
    sb_path = "src/lib/supabaseClient.ts"
    if not os.path.exists(sb_path):
        with open(sb_path, "w") as f:
            f.write(SUPABASE_CLIENT_CONTENT)
        print("   ✅ Created src/lib/supabaseClient.ts")
    else:
        print("   ⚠️  src/lib/supabaseClient.ts already exists. (Skipped overwrite)")

def main():
    clean_archived_duplicates()
    create_golden_files()
    
    print("\n" + "="*40)
    print("🚀 CONSOLIDATION COMPLETE")
    print("="*40)
    print("NEXT STEPS:")
    print("1. Search your code for 'Intl.NumberFormat' and replace with:")
    print("   import { formatCurrency } from '@/lib/utils'")
    print("2. Search your code for 'createClient(' inside components and replace with:")
    print("   import { supabase } from '@/lib/supabaseClient'")

if __name__ == "__main__":
    main()
