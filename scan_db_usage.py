import os
import re

# --- CONFIGURATION ---
# The folder to scan (current folder)
ROOT_DIR = "."
# File types to check
EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.sql'}

# The "Golden" tables we expect (from Annex B)
EXPECTED_TABLES = {
    "leads", "quotes", "jobs", "expenses", "ckr_knowledge", 
    "case_studies", "profiles", "user_roles", "system_audit"
}

def find_table_usages(root_dir):
    used_tables = set()
    
    # Regex to find .from('table') or from "table"
    # Matches: .from('leads') OR from "leads" (SQL)
    pattern = re.compile(r"[\.\s]from\s*\(\s*['\"]([a-zA-Z0-9_]+)['\"]\s*\)|from\s+['\"]?([a-zA-Z0-9_]+)['\"]?", re.IGNORECASE)

    print(f"🕵️  Scanning codebase in {os.path.abspath(root_dir)}...")

    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules and hidden folders
        if 'node_modules' in root or '.git' in root:
            continue
            
        for file in files:
            _, ext = os.path.splitext(file)
            if ext in EXTENSIONS:
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        
                    # Find all matches
                    matches = pattern.findall(content)
                    for match in matches:
                        # Regex groups can be empty, find the valid one
                        table_name = match[0] if match[0] else match[1]
                        if table_name and len(table_name) > 2:
                            # Filter out common false positives if any
                            if table_name not in ['react', 'supabase']:
                                used_tables.add(table_name)
                                
                except Exception as e:
                    pass # Skip unreadable files

    return used_tables

def main():
    real_tables = find_table_usages(ROOT_DIR)
    
    print("\n" + "="*40)
    print("📊 CODEBASE USAGE REPORT")
    print("="*40)
    
    print(f"\n✅ TABLES ACTUALLY USED IN CODE ({len(real_tables)}):")
    for t in sorted(list(real_tables)):
        if t in EXPECTED_TABLES:
            print(f"  🟢 {t} (Verified Golden)")
        else:
            print(f"  🔵 {t} (Undocumented / Custom)")

    print("\n" + "-"*40)
    
    # Calculate Excess (Tables in Golden list but NOT found in code)
    unused_golden = EXPECTED_TABLES - real_tables
    
    if unused_golden:
        print(f"⚠️  GOLDEN TABLES NOT FOUND IN CODE:")
        for t in unused_golden:
            print(f"  ❓ {t} (Is this actually needed?)")
    else:
        print("🎉 All Golden Tables are verified active!")

    print("\n" + "="*40)
    print("ACTION PLAN:")
    print("1. Compare the 'Verified' list above with your Supabase Dashboard.")
    print("2. If Supabase has a table NOT listed above, it is likely 'Dead Weight'.")
    print("3. DELETE any table that is neither Green 🟢 nor Blue 🔵.")

if __name__ == "__main__":
    main()

