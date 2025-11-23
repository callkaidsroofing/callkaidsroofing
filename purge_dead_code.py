import os
import re

# --- CONFIGURATION ---
ROOT_DIR = "."
EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx'}

# The list of tables we just deleted (The Dead Weight)
DEAD_TABLES = [
    "ai_action_log", "ai_analysis_cache", "ai_generation_history", 
    "ai_optimization_history", "chat_analytics", "chat_conversations", 
    "chat_messages", "content_sync_log", "knowledge_chunks", 
    "knowledge_vectors", "security_events", "security_logs", 
    "security_scan_results", "voice_transcriptions", "social_posts"
]

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    new_lines = []
    modified = False
    
    # Regex to find the table name inside quotes: 'table_name' or "table_name"
    # We use \b boundary checks to avoid partial matches
    patterns = [re.compile(f"['\"]{table}['\"]") for table in DEAD_TABLES]

    for line in lines:
        # Skip lines that are already commented
        if line.strip().startswith("//") or line.strip().startswith("{/*"):
            new_lines.append(line)
            continue

        match_found = False
        for pattern in patterns:
            if pattern.search(line):
                # Found a dead table! Comment it out.
                new_lines.append(f"// [AUTO-PURGE] {line}")
                match_found = True
                modified = True
                break # Move to next line
        
        if not match_found:
            new_lines.append(line)

    if modified:
        print(f"   ✂️ Patching: {file_path}")
        # 1. Create Backup
        with open(file_path + ".bak", 'w', encoding='utf-8') as f:
            f.writelines(lines)
        # 2. Overwrite Original
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)

def main():
    print(f"🚀 Starting Code Purge in: {os.path.abspath(ROOT_DIR)}")
    print(f"🎯 Targeting {len(DEAD_TABLES)} dead tables...")
    
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        if 'node_modules' in root or '.git' in root:
            continue
            
        for file in files:
            _, ext = os.path.splitext(file)
            if ext in EXTENSIONS:
                process_file(os.path.join(root, file))
                count += 1

    print("\n" + "="*40)
    print(f"✅ PURGE COMPLETE")
    print(f"📊 Scanned {count} files.")
    print("👉 Modified files have a .bak backup next to them.")
    print("👉 Search for '[AUTO-PURGE]' in your editor to see what was removed.")
    print("="*40)

if __name__ == "__main__":
    main()

