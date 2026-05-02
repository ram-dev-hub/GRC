#!/usr/bin/env node
/**
 * Jira MCP Server Connectivity Test
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const rawUrl = process.env.JIRA_BASE_URL || '';
// Strip any path after the hostname to get a clean base URL
const baseUrl = rawUrl.match(/^(https?:\/\/[^/]+)/)?.[1] || rawUrl;

const email = process.env.JIRA_EMAIL;
const apiToken = process.env.JIRA_API_TOKEN;

console.log('=== Jira MCP Server Connectivity Test ===\n');
console.log('Config:');
console.log('  Raw URL  :', rawUrl || '(not set)');
console.log('  Base URL :', baseUrl || '(not set)');
console.log('  Email    :', email || '(not set)');
console.log('  Token    :', apiToken ? `${apiToken.slice(0, 8)}...` : '(not set)');
console.log('');

if (!baseUrl || !email || !apiToken) {
  console.error('ERROR: Missing required env vars. Check jira-mcp-server/.env');
  process.exit(1);
}

const client = axios.create({
  baseURL: `${baseUrl}/rest/api/3`,
  auth: { username: email, password: apiToken },
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
});

async function test(label, fn) {
  process.stdout.write(`Testing ${label}... `);
  try {
    const result = await fn();
    console.log('OK', result ? `(${result})` : '');
    return true;
  } catch (err) {
    const status = err.response?.status;
    const msg = err.response?.data?.message || err.response?.data?.errorMessages?.[0] || err.message;
    console.log(`FAIL [${status || 'network'}] ${msg}`);
    return false;
  }
}

(async () => {
  let passed = 0;
  const total = 3;

  if (await test('/myself (auth check)', async () => {
    const r = await client.get('/myself');
    return `${r.data.displayName} <${r.data.emailAddress}>`;
  })) passed++;

  if (await test('/project (list projects)', async () => {
    const r = await client.get('/project');
    return `${r.data.length} project(s)`;
  })) passed++;

  if (await test('/project/GRC (GRC project)', async () => {
    const r = await client.get('/project/GRC');
    return `key=${r.data.key} name="${r.data.name}"`;
  })) passed++;

  console.log(`\nResult: ${passed}/${total} tests passed`);
  if (passed < total) process.exit(1);
})();
