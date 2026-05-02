#!/usr/bin/env node

/**
 * Jira Bulk Import Script for GRC Risk Module
 *
 * This script reads the jira-structure.json file and creates epics, stories, and tasks
 * in Jira using the Jira MCP Server.
 *
 * Usage: node import-clean.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', 'jira-mcp-server', '.env') });

// Import Jira MCP Server (using compiled JavaScript)
const { JiraMCPServer } = await import('./dist/index.js');

async function main() {
  try {
    console.log('🚀 Starting Jira Bulk Import for GRC Risk Module...\n');

    // Load structure file
    const structurePath = path.join(__dirname, '..', 'Stories', 'jira-structure.json');
    if (!fs.existsSync(structurePath)) {
      throw new Error(`Structure file not found: ${structurePath}`);
    }

    const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));
    console.log(`📋 Loaded structure for project: ${structure.project}`);
    console.log(`📊 Found ${structure.epics.length} epics to import\n`);

    // Initialize Jira MCP Server
    const server = new JiraMCPServer();
    await server.initialize();

    let totalCreated = 0;

    // Process each epic
    for (const epic of structure.epics) {
      console.log(`🎯 Creating Epic: ${epic.name}`);

      try {
        // Create epic
        const epicResult = await server.createEpic({
          summary: epic.summary,
          description: epic.description,
          projectKey: structure.project
        });

        console.log(`✅ Created Epic: ${epicResult.key} - ${epic.name}`);
        totalCreated++;

        // Create stories for this epic
        for (const story of epic.stories) {
          console.log(`  📝 Creating Story: ${story.summary}`);

          try {
            // Create story linked to epic
            const storyResult = await server.createIssue({
              summary: story.summary,
              description: story.description,
              issueType: 'Story',
              projectKey: structure.project,
              epicKey: epicResult.key
            });

            console.log(`  ✅ Created Story: ${storyResult.key} - ${story.summary}`);
            totalCreated++;

            // Create tasks for this story
            for (const task of story.tasks) {
              console.log(`    🔧 Creating Task: ${task}`);

              try {
                const taskResult = await server.createIssue({
                  summary: task,
                  description: `Task for story: ${story.summary}`,
                  issueType: 'Task',
                  projectKey: structure.project,
                  parentKey: storyResult.key
                });

                console.log(`    ✅ Created Task: ${taskResult.key} - ${task}`);
                totalCreated++;

              } catch (taskError) {
                console.error(`    ❌ Failed to create task "${task}": ${taskError.message}`);
              }
            }

          } catch (storyError) {
            console.error(`  ❌ Failed to create story "${story.summary}": ${storyError.message}`);
          }
        }

        console.log(''); // Empty line between epics

      } catch (epicError) {
        console.error(`❌ Failed to create epic "${epic.name}": ${epicError.message}`);
      }
    }

    console.log(`\n🎉 Import completed! Created ${totalCreated} issues in Jira.`);
    console.log(`📊 Project: ${structure.project} (ARKSGRC spaces)`);

  } catch (error) {
    console.error('💥 Import failed:', error.message);
    process.exit(1);
  }
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };