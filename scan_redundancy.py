import os
import re
from collections import defaultdict

ROOT_DIR = "."
EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx'}
OUTPUT_FILE = "redundancy_report.txt"

# Patterns that indicate a "Core Tool" definition
PATTERNS = {
    "Supabase Client": r"createClient\(",
    "OpenAI Client": r"new OpenAI\(",
    "Email Sender": r"resend\.emails\.send",
    "Date Formatter": r"format\(|new Date\(",
    "Currency Formatter": r"Intl\.NumberFormat",
}

def scan_codebase():
    tool_locations = defaultdict(list)
    file_names = defaultdict(list)
    output_lines = []

    print(f"🕵️  Hunting for Duplicates in {os.path.abspath(ROOT_DIR)}...")

    for root, dirs, files in os.walk(ROOT_DIR):
        if 'node_modules' in root or '.git' in root:
            continue
            
        for file in files:
            _, ext = os.path.splitext(file)
            if ext in EXTENSIONS:
                path = os.path.join(root, file)
                
                # Check for Duplicate File Names
                file_names[file].append(path)

                # Check for Duplicate Tool Definitions
                try:
                    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        for tool, pattern in PATTERNS.items():
                            if re.search(pattern, content):
                                tool_locations[tool].append(path)
                except:
                    pass

    # --- GENERATE REPORT ---
    output_lines.append("="*50)
    output_lines.append("🚩 DUPLICATE TOOL DEFINITIONS (Merge These!)")
    output_lines.append("="*50)
    
    for tool, paths in tool_locations.items():
        if len(paths) > 1:
            output_lines.append(f"\n⚠️  {tool} defined in {len(paths)} places:")
            for p in sorted(paths): # Sort for readability
                output_lines.append(f"   - {p}")

    output_lines.append("\n" + "="*50)
    output_lines.append("🚩 DUPLICATE FILE NAMES (Confusing Imports)")
    output_lines.append("="*50)
    
    for name, paths in file_names.items():
        # Filter out common Next.js/React file names that are supposed to be duplicated
        if len(paths) > 1 and name not in ['page.tsx', 'layout.tsx', 'loading.tsx', 'error.tsx', 'index.ts', 'route.ts']:
            output_lines.append(f"\n⚠️  {name} exists in {len(paths)} places:")
            for p in sorted(paths):
                output_lines.append(f"   - {p}")

    # --- SAVE TO FILE ---
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("\n".join(output_lines))

    # --- PRINT TO SCREEN ---
    print("\n".join(output_lines))
    print("\n" + "="*50)
    print(f"💾 Report saved to: {OUTPUT_FILE}")
    print("="*50)

if __name__ == "__main__":
    scan_codebase()

