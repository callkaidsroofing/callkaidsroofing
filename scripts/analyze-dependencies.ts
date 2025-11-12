#!/usr/bin/env tsx
/**
 * Edge Function Dependency Analyzer
 * Scans all edge functions and extracts:
 * - Database table dependencies
 * - Secret/environment variable usage
 * - Inter-function calls
 * - Frontend callsites
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface FunctionDependencies {
  name: string;
  status: 'active' | 'dormant' | 'unknown';
  path: string;
  tables_used: string[];
  secrets_required: string[];
  calls_functions: string[];
  called_from: string[];
  verify_jwt: boolean;
  lines_of_code: number;
  last_modified?: string;
}

interface DependencyReport {
  generated_at: string;
  total_functions: number;
  active_functions: number;
  dormant_functions: number;
  functions: Record<string, FunctionDependencies>;
  stats: {
    most_used_tables: Array<{ table: string; count: number }>;
    most_used_secrets: Array<{ secret: string; count: number }>;
    orphaned_functions: string[];
  };
}

// Regex patterns for detection
const TABLE_PATTERN = /\.from\(['"`]([a-z_]+)['"`]\)/g;
const SECRET_PATTERN = /Deno\.env\.get\(['"`]([A-Z_]+)['"`]\)/g;
const FUNCTION_CALL_PATTERN = /supabase\.functions\.invoke\(['"`]([a-z-]+)['"`]/g;

async function scanEdgeFunction(functionPath: string, functionName: string): Promise<FunctionDependencies> {
  const indexPath = join(functionPath, 'index.ts');
  
  if (!existsSync(indexPath)) {
    return {
      name: functionName,
      status: 'unknown',
      path: functionPath,
      tables_used: [],
      secrets_required: [],
      calls_functions: [],
      called_from: [],
      verify_jwt: false,
      lines_of_code: 0,
    };
  }

  const content = await readFile(indexPath, 'utf-8');
  const lines = content.split('\n');

  // Extract table dependencies
  const tables = new Set<string>();
  let match;
  const tableRegex = new RegExp(TABLE_PATTERN.source, 'g');
  while ((match = tableRegex.exec(content)) !== null) {
    tables.add(match[1]);
  }

  // Extract secret dependencies
  const secrets = new Set<string>();
  const secretRegex = new RegExp(SECRET_PATTERN.source, 'g');
  while ((match = secretRegex.exec(content)) !== null) {
    secrets.add(match[1]);
  }

  // Extract inter-function calls
  const functionCalls = new Set<string>();
  const functionRegex = new RegExp(FUNCTION_CALL_PATTERN.source, 'g');
  while ((match = functionRegex.exec(content)) !== null) {
    functionCalls.add(match[1]);
  }

  return {
    name: functionName,
    status: 'unknown', // Will be determined by frontend scan
    path: functionPath,
    tables_used: Array.from(tables),
    secrets_required: Array.from(secrets),
    calls_functions: Array.from(functionCalls),
    called_from: [],
    verify_jwt: false, // Will be read from config.toml
    lines_of_code: lines.length,
  };
}

async function scanFrontendCalls(srcPath: string): Promise<Record<string, string[]>> {
  const callMap: Record<string, string[]> = {};

  async function scanDirectory(dirPath: string) {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        const content = await readFile(fullPath, 'utf-8');
        const invokeRegex = /supabase\.functions\.invoke\(['"`]([a-z-]+)['"`]/g;
        let match;

        while ((match = invokeRegex.exec(content)) !== null) {
          const functionName = match[1];
          const relativePath = fullPath.replace(process.cwd(), '');

          if (!callMap[functionName]) {
            callMap[functionName] = [];
          }
          callMap[functionName].push(relativePath);
        }
      }
    }
  }

  await scanDirectory(srcPath);
  return callMap;
}

async function parseConfigToml(configPath: string): Promise<Record<string, boolean>> {
  const content = await readFile(configPath, 'utf-8');
  const jwtMap: Record<string, boolean> = {};

  const lines = content.split('\n');
  let currentFunction: string | null = null;

  for (const line of lines) {
    const functionMatch = line.match(/\[functions\.([a-z-]+)\]/);
    if (functionMatch) {
      currentFunction = functionMatch[1];
    }

    const jwtMatch = line.match(/verify_jwt\s*=\s*(true|false)/);
    if (jwtMatch && currentFunction) {
      jwtMap[currentFunction] = jwtMatch[1] === 'true';
    }
  }

  return jwtMap;
}

async function main() {
  console.log('🔍 Starting Edge Function Dependency Analysis...\n');

  const functionsDir = join(process.cwd(), 'supabase', 'functions');
  const srcDir = join(process.cwd(), 'src');
  const configPath = join(process.cwd(), 'supabase', 'config.toml');

  // Scan all edge functions
  const functionEntries = await readdir(functionsDir, { withFileTypes: true });
  const functions: Record<string, FunctionDependencies> = {};

  console.log('📦 Scanning edge functions...');
  for (const entry of functionEntries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_')) {
      const functionPath = join(functionsDir, entry.name);
      functions[entry.name] = await scanEdgeFunction(functionPath, entry.name);
      process.stdout.write('.');
    }
  }
  console.log(` Found ${Object.keys(functions).length} functions\n`);

  // Scan frontend for function calls
  console.log('🔎 Scanning frontend for function calls...');
  const frontendCalls = await scanFrontendCalls(srcDir);
  console.log(` Scanned src/ directory\n`);

  // Parse config.toml for JWT settings
  console.log('⚙️  Reading config.toml for JWT settings...');
  const jwtSettings = await parseConfigToml(configPath);
  console.log(` Loaded settings for ${Object.keys(jwtSettings).length} functions\n`);

  // Merge frontend call data and determine status
  for (const [funcName, deps] of Object.entries(functions)) {
    deps.called_from = frontendCalls[funcName] || [];
    deps.verify_jwt = jwtSettings[funcName] || false;
    deps.status = deps.called_from.length > 0 ? 'active' : 'dormant';
  }

  // Calculate statistics
  const tableUsage: Record<string, number> = {};
  const secretUsage: Record<string, number> = {};

  for (const func of Object.values(functions)) {
    func.tables_used.forEach(table => {
      tableUsage[table] = (tableUsage[table] || 0) + 1;
    });
    func.secrets_required.forEach(secret => {
      secretUsage[secret] = (secretUsage[secret] || 0) + 1;
    });
  }

  const mostUsedTables = Object.entries(tableUsage)
    .map(([table, count]) => ({ table, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const mostUsedSecrets = Object.entries(secretUsage)
    .map(([secret, count]) => ({ secret, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const orphanedFunctions = Object.values(functions)
    .filter(f => f.status === 'dormant')
    .map(f => f.name);

  const report: DependencyReport = {
    generated_at: new Date().toISOString(),
    total_functions: Object.keys(functions).length,
    active_functions: Object.values(functions).filter(f => f.status === 'active').length,
    dormant_functions: Object.values(functions).filter(f => f.status === 'dormant').length,
    functions,
    stats: {
      most_used_tables: mostUsedTables,
      most_used_secrets: mostUsedSecrets,
      orphaned_functions: orphanedFunctions,
    },
  };

  // Write report
  const outputPath = join(process.cwd(), 'docs', 'DEPENDENCY_MAP.json');
  await writeFile(outputPath, JSON.stringify(report, null, 2));

  console.log('✅ Analysis Complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Total Functions: ${report.total_functions}`);
  console.log(`   Active Functions: ${report.active_functions}`);
  console.log(`   Dormant Functions: ${report.dormant_functions}`);
  console.log(`   Orphaned Functions: ${orphanedFunctions.length}`);
  console.log(`\n💾 Report saved to: ${outputPath}`);
  console.log(`\n🔝 Top 5 Most Used Tables:`);
  mostUsedTables.slice(0, 5).forEach(({ table, count }) => {
    console.log(`   - ${table}: ${count} functions`);
  });
  console.log(`\n🔐 Top 5 Most Used Secrets:`);
  mostUsedSecrets.slice(0, 5).forEach(({ secret, count }) => {
    console.log(`   - ${secret}: ${count} functions`);
  });
}

main().catch(console.error);
