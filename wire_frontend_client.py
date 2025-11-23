import os
import re

# ONLY scan the Frontend source code
ROOT_DIR = "./src"
EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx'}

# The Golden Import we want to inject
NEW_IMPORT = 'import { supabase } from "@/lib/supabaseClient";'

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Skip files that already use the golden client
    if '@/lib/supabaseClient' in content:
        return

    # Check if this file actually creates a manual client
    # We look for: createClient(
    if 'createClient(' not in content:
        return

    print(f"   ⚡ Wiring: {file_path}")
    
    lines = content.split('\n')
    new_lines = []
    import_added = False
    
    for line in lines:
        # 1. INJECT THE NEW IMPORT (At the top, after other imports)
        if not import_added and (line.startswith('import') or line.strip() == ''):
            # Just a heuristic: add it as the very first line or after the last import?
            # Easiest: Add it at the very top, or replace the old import.
            pass 

        # 2. DISABLE THE OLD IMPORT
        if 'import' in line and 'createClient' in line and '@supabase/supabase-js' in line:
            new_lines.append(f"// [AUTO-WIRE] {line}")
            # Inject new import right here to keep things tidy
            new_lines.append(NEW_IMPORT)
            import_added = True
            continue

        # 3. DISABLE THE MANUAL INITIALIZATION
        # Matches: const supabase = createClient(...)
        if 'createClient(' in line and '=' in line:
            new_lines.append(f"// [AUTO-WIRE] {line}")
            continue

        new_lines.append(line)

    # Fallback: If we didn't find the old import line to swap, append to top
    if not import_added:
        new_lines.insert(0, NEW_IMPORT)

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

def main():
    print(f"🚀 Starting Frontend Wiring in: {os.path.abspath(ROOT_DIR)}")
    
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            _, ext = os.path.splitext(file)
            if ext in EXTENSIONS:
                process_file(os.path.join(root, file))
                count += 1

    print("\n" + "="*40)
    print(f"✅ WIRING COMPLETE")
    print(f"📊 Scanned {count} frontend files.")
    print("👉 Manual connections have been commented out.")
    print("👉 New Golden Client has been imported.")
    print("="*40)

if __name__ == "__main__":
    main()

