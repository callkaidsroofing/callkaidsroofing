#!/usr/bin/env tsx
/**
 * OpenAPI 3.0 Spec Generator for CKR Edge Functions
 * Generates comprehensive API documentation
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface OpenAPISpec {
  openapi: string;
  info: any;
  servers: any[];
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
  };
  security: any[];
}

interface FunctionMetadata {
  name: string;
  summary: string;
  description: string;
  verify_jwt: boolean;
  request_schema?: any;
  response_schema?: any;
  errors?: any[];
  examples?: any[];
}

async function extractFunctionMetadata(functionPath: string, functionName: string): Promise<FunctionMetadata | null> {
  const indexPath = join(functionPath, 'index.ts');
  
  if (!existsSync(indexPath)) {
    return null;
  }

  const content = await readFile(indexPath, 'utf-8');

  // Extract JSDoc comments or inline documentation
  const summaryMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
  const summary = summaryMatch ? summaryMatch[1].trim() : `${functionName} edge function`;

  // Extract interface definitions for request/response
  const interfaceMatch = content.match(/interface\s+(\w+Request)\s*\{([^}]+)\}/);
  const requestSchema = interfaceMatch ? parseTypescriptInterface(interfaceMatch[2]) : null;

  // Basic metadata
  const metadata: FunctionMetadata = {
    name: functionName,
    summary,
    description: extractDescription(content, functionName),
    verify_jwt: false, // Will be populated from config.toml
    request_schema: requestSchema,
  };

  return metadata;
}

function parseTypescriptInterface(interfaceBody: string): any {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  const lines = interfaceBody.split('\n');
  for (const line of lines) {
    const propMatch = line.match(/^\s*(\w+)(\?)?:\s*([^;]+);/);
    if (propMatch) {
      const [, propName, optional, propType] = propMatch;
      const isRequired = !optional;

      properties[propName] = {
        type: mapTypescriptToJsonSchema(propType.trim()),
        description: extractInlineComment(line),
      };

      if (isRequired) {
        required.push(propName);
      }
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

function mapTypescriptToJsonSchema(tsType: string): string {
  if (tsType === 'string') return 'string';
  if (tsType === 'number') return 'number';
  if (tsType === 'boolean') return 'boolean';
  if (tsType.includes('[]')) return 'array';
  if (tsType.includes('|')) return 'string'; // Union types -> string
  return 'object';
}

function extractInlineComment(line: string): string {
  const commentMatch = line.match(/\/\/\s*(.+)$/);
  return commentMatch ? commentMatch[1].trim() : '';
}

function extractDescription(content: string, functionName: string): string {
  // Try to extract description from multi-line JSDoc
  const docMatch = content.match(/\/\*\*\s*\n([\s\S]*?)\*\//);
  if (docMatch) {
    const lines = docMatch[1]
      .split('\n')
      .map(l => l.replace(/^\s*\*\s?/, '').trim())
      .filter(l => l.length > 0);
    return lines.join(' ').slice(0, 500);
  }

  // Fallback to common patterns
  if (functionName.includes('lead')) {
    return 'Handles lead capture and notification workflows for customer inquiries.';
  }
  if (functionName.includes('quote')) {
    return 'Manages quote generation, calculation, and delivery processes.';
  }
  if (functionName.includes('rag') || functionName.includes('search')) {
    return 'Performs RAG-powered search across knowledge base using vector embeddings.';
  }
  if (functionName.includes('chat')) {
    return 'Provides AI-powered chat assistance with RAG context retrieval.';
  }

  return `Provides ${functionName.replace(/-/g, ' ')} functionality for the CKR Digital Engine.`;
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
  console.log('📝 Generating OpenAPI 3.0 Specification...\n');

  const functionsDir = join(process.cwd(), 'supabase', 'functions');
  const configPath = join(process.cwd(), 'supabase', 'config.toml');
  const outputPath = join(process.cwd(), 'docs', 'api', 'openapi.yaml');

  // Parse JWT settings
  const jwtSettings = await parseConfigToml(configPath);

  // Scan all edge functions
  const functionEntries = await readdir(functionsDir, { withFileTypes: true });
  const paths: Record<string, any> = {};

  console.log('🔍 Scanning edge functions...');
  for (const entry of functionEntries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_')) {
      const functionPath = join(functionsDir, entry.name);
      const metadata = await extractFunctionMetadata(functionPath, entry.name);

      if (metadata) {
        metadata.verify_jwt = jwtSettings[entry.name] || false;

        // Build path definition
        const pathKey = `/${entry.name}`;
        paths[pathKey] = {
          post: {
            summary: metadata.summary,
            description: metadata.description,
            operationId: entry.name.replace(/-/g, '_'),
            tags: [inferTag(entry.name)],
            security: metadata.verify_jwt ? [{ bearerAuth: [] }] : [],
            requestBody: metadata.request_schema
              ? {
                  required: true,
                  content: {
                    'application/json': {
                      schema: metadata.request_schema,
                    },
                  },
                }
              : undefined,
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object' },
                      },
                    },
                  },
                },
              },
              '400': {
                description: 'Bad request - validation error',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        error: { type: 'string' },
                      },
                    },
                  },
                },
              },
              '401': {
                description: 'Unauthorized - invalid or missing JWT token',
              },
              '500': {
                description: 'Internal server error',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        error: { type: 'string' },
                        details: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        };
        process.stdout.write('.');
      }
    }
  }
  console.log(` Processed ${Object.keys(paths).length} functions\n`);

  // Build OpenAPI spec
  const spec: OpenAPISpec = {
    openapi: '3.0.0',
    info: {
      title: 'CKR Digital Engine API',
      version: '1.0.0',
      description: `
# Call Kaids Roofing Digital Engine API

Complete API documentation for all edge functions in the CKR Digital Engine.

## Business Information
- **Company:** Call Kaids Roofing
- **ABN:** 39475055075
- **Phone:** 0435 900 709
- **Email:** info@callkaidsroofing.com.au
- **Service Area:** SE Melbourne, Australia

## Authentication
Functions marked with 🔐 require JWT authentication via Supabase Auth.
Public functions can be called with just the anon key.

## Base URL
All endpoints are relative to: \`https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1\`

## Rate Limiting
Public endpoints (forms, lead capture) are rate-limited to 5 requests/minute per IP.
      `.trim(),
      contact: {
        name: 'CKR Development Team',
        email: 'info@callkaidsroofing.com.au',
      },
      license: {
        name: 'Proprietary',
      },
    },
    servers: [
      {
        url: 'https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1',
        description: 'Production Supabase Edge Functions',
      },
    ],
    paths,
    components: {
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'string' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Supabase JWT token from auth.session',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'apikey',
          description: 'Supabase anon key',
        },
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  };

  // Write YAML file
  const yamlContent = generateYAML(spec);
  await writeFile(outputPath, yamlContent);

  console.log('✅ OpenAPI Spec Generated!\n');
  console.log(`📄 Specification: ${outputPath}`);
  console.log(`📊 Total Endpoints: ${Object.keys(paths).length}`);
  console.log(`🔐 JWT Protected: ${Object.values(paths).filter((p: any) => p.post?.security?.length > 0).length}`);
  console.log(`🌐 Public: ${Object.values(paths).filter((p: any) => !p.post?.security || p.post.security.length === 0).length}`);
}

function inferTag(functionName: string): string {
  if (functionName.includes('lead') || functionName.includes('quote') || functionName.includes('job')) {
    return 'CRM';
  }
  if (functionName.includes('rag') || functionName.includes('search') || functionName.includes('chat') || functionName.includes('knowledge')) {
    return 'AI & RAG';
  }
  if (functionName.includes('notion') || functionName.includes('sync')) {
    return 'Integrations';
  }
  if (functionName.includes('admin') || functionName.includes('user')) {
    return 'Admin';
  }
  if (functionName.includes('email') || functionName.includes('notification')) {
    return 'Notifications';
  }
  return 'General';
}

function generateYAML(spec: OpenAPISpec): string {
  // Simple YAML serializer (for production, use a library like 'js-yaml')
  return JSON.stringify(spec, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/^\s{2}/gm, '  ');
}

main().catch(console.error);
