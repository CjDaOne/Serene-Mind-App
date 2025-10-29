#!/usr/bin/env node

/**
 * API Endpoint Testing Script - Agent 6
 * Tests all API endpoints for functionality and error handling
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

async function testEndpoint(name, method, url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: 'include',
    });

    const data = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = data;
    }

    const passed = options.expectedStatus
      ? response.status === options.expectedStatus
      : response.ok;

    results.tests.push({
      name,
      passed,
      status: response.status,
      expectedStatus: options.expectedStatus,
      data: jsonData,
    });

    if (passed) {
      results.passed++;
      log(`✓ ${name} (${response.status})`, 'green');
    } else {
      results.failed++;
      log(`✗ ${name} (${response.status}, expected ${options.expectedStatus})`, 'red');
      if (jsonData?.error) {
        log(`  Error: ${jsonData.error}`, 'yellow');
      }
    }

    return { response, data: jsonData };
  } catch (error) {
    results.failed++;
    results.tests.push({
      name,
      passed: false,
      error: error.message,
    });
    log(`✗ ${name} - Error: ${error.message}`, 'red');
    return { error };
  }
}

async function runTests() {
  log('\n========================================', 'blue');
  log('API Endpoint Testing - Agent 6', 'blue');
  log('========================================\n', 'blue');

  log('Testing affirmations endpoint (no auth required)...', 'yellow');
  await testEndpoint(
    'GET /api/affirmations - Should return random affirmation',
    'GET',
    '/api/affirmations',
    { expectedStatus: 200 }
  );

  const affirmations = new Set();
  for (let i = 0; i < 5; i++) {
    const result = await testEndpoint(
      `GET /api/affirmations - Call ${i + 1}`,
      'GET',
      '/api/affirmations',
      { expectedStatus: 200 }
    );
    if (result.data?.affirmation) {
      affirmations.add(result.data.affirmation);
    }
  }
  
  if (affirmations.size > 1) {
    log(`✓ Affirmations are random (${affirmations.size} unique)`, 'green');
    results.passed++;
  } else {
    log('✗ Affirmations not showing randomness', 'red');
    results.failed++;
  }

  log('\nTesting endpoints without authentication...', 'yellow');
  
  await testEndpoint(
    'GET /api/tasks - Without auth',
    'GET',
    '/api/tasks',
    { expectedStatus: 401 }
  );

  await testEndpoint(
    'POST /api/tasks - Without auth',
    'POST',
    '/api/tasks',
    {
      expectedStatus: 401,
      body: {
        title: 'Test Task',
        completed: false,
        dueDate: new Date().toISOString(),
        priority: 'medium',
        subtasks: [],
      },
    }
  );

  await testEndpoint(
    'GET /api/journal - Without auth',
    'GET',
    '/api/journal',
    { expectedStatus: 401 }
  );

  await testEndpoint(
    'POST /api/journal - Without auth',
    'POST',
    '/api/journal',
    {
      expectedStatus: 401,
      body: {
        date: new Date().toISOString(),
        mood: 'happy',
        content: 'Test entry',
      },
    }
  );

  await testEndpoint(
    'GET /api/rewards - Without auth',
    'GET',
    '/api/rewards',
    { expectedStatus: 401 }
  );

  log('\n========================================', 'blue');
  log('TEST SUMMARY', 'blue');
  log('========================================', 'blue');
  log(`Total Tests: ${results.passed + results.failed}`, 'yellow');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log('========================================\n', 'blue');

  return results;
}

runTests().then((results) => {
  process.exit(results.failed > 0 ? 1 : 0);
});
