#!/usr/bin/env node

/**
 * Simple Jira Bulk Import Script for GRC Risk Module
 *
 * This script reads the jira-structure.json file and creates epics, stories, and tasks
 * in Jira using direct REST API calls.
 *
 * Usage: node simple-import.js
 */

console.log('🔍 Script starting...');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

console.log('📦 Imports loaded...');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔧 Environment loaded...');

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

console.log('🔑 Credentials check...');
console.log('   Base URL:', JIRA_BASE_URL ? 'Set' : 'Missing');
console.log('   Email:', JIRA_EMAIL ? 'Set' : 'Missing');
console.log('   Token:', JIRA_API_TOKEN ? 'Set' : 'Missing');

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   JIRA_BASE_URL:', JIRA_BASE_URL ? '✓' : '✗');
  console.error('   JIRA_EMAIL:', JIRA_EMAIL ? '✓' : '✗');
  console.error('   JIRA_API_TOKEN:', JIRA_API_TOKEN ? '✓' : '✗');
  process.exit(1);
}

console.log('✅ All credentials present');

// Create axios instance with auth
const jiraClient = axios.create({
  baseURL: JIRA_BASE_URL.replace('/software/projects/GRC/boards/1', ''), // Clean base URL
  auth: {
    username: JIRA_EMAIL,
    password: JIRA_API_TOKEN
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

console.log('🌐 Axios client created with base URL:', jiraClient.defaults.baseURL);

async function createEpic(projectKey, name, summary, description) {
  try {
    const response = await jiraClient.post('/rest/api/3/issue', {
      fields: {
        project: { key: projectKey },
        issuetype: { name: 'Epic' },
        summary: summary,
        description: {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: description }]
          }]
        },
        customfield_10011: name // Epic Name field
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create epic "${name}":`, error.response?.data || error.message);
    throw error;
  }
}

async function createStory(projectKey, summary, description, epicKey) {
  try {
    const response = await jiraClient.post('/rest/api/3/issue', {
      fields: {
        project: { key: projectKey },
        issuetype: { name: 'Story' },
        summary: summary,
        description: {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: description }]
          }]
        },
        customfield_10014: epicKey // Epic Link field
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create story "${summary}":`, error.response?.data || error.message);
    throw error;
  }
}

async function createTask(projectKey, summary, description, parentKey) {
  try {
    const response = await jiraClient.post('/rest/api/3/issue', {
      fields: {
        project: { key: projectKey },
        issuetype: { name: 'Task' },
        summary: summary,
        description: {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: description }]
          }]
        },
        parent: { key: parentKey } // Parent issue for subtask
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create task "${summary}":`, error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting Simple Jira Bulk Import for GRC Risk Module...\n');

    // Test connection
    console.log('🔗 Testing Jira connection...');
    try {
      console.log('   Calling /rest/api/3/myself...');
      const testResponse = await jiraClient.get('/rest/api/3/myself');
      console.log('   Response status:', testResponse.status);
      console.log('✅ Jira connection successful\n');
    } catch (error) {
      console.error('❌ Jira connection failed');
      console.error('   Status:', error.response?.status);
      console.error('   Status Text:', error.response?.statusText);
      console.error('   Error:', error.response?.data || error.message);
      console.error('   URL attempted:', error.config?.url);
      process.exit(1);
    }

    // Load structure file
    const structurePath = path.join(__dirname, '..', 'Stories', 'jira-structure.json');
    if (!fs.existsSync(structurePath)) {
      throw new Error(`Structure file not found: ${structurePath}`);
    }

    const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));
    console.log(`📋 Loaded structure for project: ${structure.project}`);
    console.log(`📊 Found ${structure.epics.length} epics to import\n`);

    let totalCreated = 0;

    // Process each epic
    for (const epic of structure.epics) {
      console.log(`🎯 Creating Epic: ${epic.name}`);

      try {
        // Create epic
        const epicResult = await createEpic(structure.project, epic.name, epic.summary, epic.description);
        console.log(`✅ Created Epic: ${epicResult.key} - ${epic.name}`);
        totalCreated++;

        // Create stories for this epic
        for (const story of epic.stories) {
          console.log(`  📝 Creating Story: ${story.summary}`);

          try {
            // Create story linked to epic
            const storyResult = await createStory(structure.project, story.summary, story.description, epicResult.key);
            console.log(`  ✅ Created Story: ${storyResult.key} - ${story.summary}`);
            totalCreated++;

            // Create tasks for this story
            for (const task of story.tasks) {
              console.log(`    🔧 Creating Task: ${task}`);

              try {
                const taskResult = await createTask(structure.project, task, `Task for story: ${story.summary}`, storyResult.key);
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