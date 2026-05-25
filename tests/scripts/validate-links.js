#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = '/home/cjnf/Serene-Mind-App';

// Extract all markdown file links from documentation
const mdFiles = [
  'README.md', 'AGENTS.md', 'DEPLOYMENT.md', 'DATABASE_SETUP.md',
  'docs/GUEST_MODE.md', 'docs/GUEST_MODE_FAQ.md', 'docs/SENTRY_SETUP.md',
  'src/lib/TYPES_GUIDE.md'
];

// Links to validate from all docs
const fileLinks = [
  'file:///home/cjnf/Serene-Mind-App/AGENT1_GUEST_AUTH_REPORT.md',
  'file:///home/cjnf/Serene-Mind-App/AGENT5_API_STANDARDIZER_REPORT.md',
  'file:///home/cjnf/Serene-Mind-App/AGENT6_GUEST_MODE_DOCUMENTATION_REPORT.md',
  'file:///home/cjnf/Serene-Mind-App/AGENT6_TYPE_REFACTOR_REPORT.md',
  'file:///home/cjnf/Serene-Mind-App/AGENT_A3_FEATURE_TEST_REPORT.md',
  'file:///home/cjnf/Serene-Mind-App/AGENT_A4_BUILD_VERIFICATION_REPORT.md',
  'file:///home/cjnf/Serene-Mind-App/AGENT_A6_STANDARDS_CHECK_REPORT.md',
  'file:///home/cjnf/Serene-Mind-App/AGENTS.md',
  'file:///home/cjnf/Serene-Mind-App/DATABASE_SETUP.md',
  'file:///home/cjnf/Serene-Mind-App/DEPLOYMENT.md',
  'file:///home/cjnf/Serene-Mind-App/docs/GUEST_MODE.md',
  'file:///home/cjnf/Serene-Mind-App/docs/GUEST_MODE_FAQ.md',
  'file:///home/cjnf/Serene-Mind-App/GUEST_MODE_IMPLEMENTATION.md',
  'file:///home/cjnf/Serene-Mind-App/NEXT_STEPS.md',
  'file:///home/cjnf/Serene-Mind-App/PRODUCTION_IMPROVEMENTS.md',
  'file:///home/cjnf/Serene-Mind-App/PROJECT_EXECUTION.md',
  'file:///home/cjnf/Serene-Mind-App/README.md',
  'file:///home/cjnf/Serene-Mind-App/src/lib/TYPES_GUIDE.md',
  'file:///home/cjnf/Serene-Mind-App/STATE_MANAGEMENT_REPORT.md'
];

let brokenLinks = [];
let validLinks = [];

console.log('🔍 Validating file:/// links...\n');

fileLinks.forEach(link => {
  const filePath = link.replace('file://', '').split('#')[0];
  
  if (fs.existsSync(filePath)) {
    validLinks.push(link);
    console.log(`✅ ${path.basename(filePath)}`);
  } else {
    brokenLinks.push(link);
    console.log(`❌ BROKEN: ${link}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Total links checked: ${fileLinks.length}`);
console.log(`   Valid: ${validLinks.length}`);
console.log(`   Broken: ${brokenLinks.length}`);

if (brokenLinks.length > 0) {
  console.log(`\n🔴 Broken links:`);
  brokenLinks.forEach(link => console.log(`   - ${link}`));
  process.exit(1);
}

process.exit(0);
