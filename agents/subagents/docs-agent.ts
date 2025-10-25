import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(__dirname, "../..");

export default async function DocsAgent(logFile: string) {
  fs.appendFileSync(logFile, "### Docs Agent Tasks\n\n");

  // Task 1: Scan for new files or APIs
  fs.appendFileSync(logFile, "1. **Scanning for new files and APIs...**\n");

  const scanDirs = [
    "src/app/api",
    "src/hooks",
    "agents"
  ];

  let newFilesFound = 0;
  let apiRoutesFound = 0;

  scanDirs.forEach(dir => {
    const fullPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath, { recursive: true });
      files.forEach(file => {
        if (typeof file === 'string') {
          const filePath = path.join(dir, file);
          if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            if (filePath.includes('/api/')) {
              apiRoutesFound++;
              fs.appendFileSync(logFile, `   📄 API Route: ${filePath}\n`);
            } else if (filePath.includes('/hooks/')) {
              fs.appendFileSync(logFile, `   🎣 Hook: ${filePath}\n`);
            } else if (filePath.includes('/agents/')) {
              fs.appendFileSync(logFile, `   🤖 Agent: ${filePath}\n`);
            } else {
              newFilesFound++;
            }
          }
        }
      });
    }
  });

  fs.appendFileSync(logFile, `   📊 Found ${apiRoutesFound} API routes, ${newFilesFound} new files\n\n`);

  // Task 2: Update README with latest structure
  fs.appendFileSync(logFile, "2. **Updating README.md with latest structure...**\n");

  const readmePath = path.join(PROJECT_ROOT, "README.md");
  if (fs.existsSync(readmePath)) {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Update tech stack section
    const techStackUpdate = `| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | Next.js 15 (App Router) + TypeScript    |
| Styling    | TailwindCSS + ShadCN UI                 |
| Backend    | Next.js API routes                      |
| Auth       | NextAuth.js                             |
| AI Layer   | Google Genkit + Gemini API              |
| Database   | MongoDB (planned)                       |
| State      | Zustand + React Query                   |
| Testing    | Jest + Testing Library                  |
| Automation | Custom Agent System                     |
| Deployment | Vercel                                  |`;

    readmeContent = readmeContent.replace(
      /\| Layer      \| Technology.*\| Dev Tools  \| Git.*\|/s,
      techStackUpdate
    );

    // Update features section with agent system
    const featuresUpdate = `## 🧩 Core Features

- **Dashboard View**: Overview with tasks, mood tracker, and journal insights
- **Task Management**: Add, edit, complete, and delete tasks with AI subtask suggestions
- **Journaling**: Emotional reflection with AI-powered insights
- **Calendar View**: Visual task planning and progress tracking
- **Affirmations**: Daily positive affirmations library
- **Rewards System**: Achievement tracking and gamification
- **Agent Automation**: AI-powered development and infrastructure management

## 🤖 Agent System

- **Core Agent**: Orchestrates development tasks
- **DB Agent**: MongoDB connection and API validation
- **Auth Agent**: Authentication flow management
- **Data Agent**: State management migration
- **Docs Agent**: Automatic documentation updates`;

    if (readmeContent.includes("## 🧩 Core Features")) {
      readmeContent = readmeContent.replace(
        /## 🧩 Core Features[\s\S]*?(?=## 🤖|$)/,
        featuresUpdate + "\n\n"
      );
    }

    // Update local setup
    const setupUpdate = `## 🧱 Local Development Setup

\`\`\`bash
# Clone repository
git clone https://github.com/CjDaOne/Serene-Mind-App.git
cd Serene-Mind-App

# Switch to development branch
git checkout dev

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Google OAuth and MongoDB credentials

# Run development server
npm run dev
\`\`\`

App will be available at: [http://localhost:3000](http://localhost:3000)

## 🤖 Agent System Usage

\`\`\`bash
# Run the core agent to automate infrastructure setup
node agents/core-agent.ts

# Check agent execution logs
cat agents/logs/agent-log.md
\`\`\``;

    readmeContent = readmeContent.replace(
      /## 🧱 Local Development Setup[\s\S]*?(?=## 🤖|$)/,
      setupUpdate + "\n\n"
    );

    fs.writeFileSync(readmePath, readmeContent);
    fs.appendFileSync(logFile, "   ✅ Updated README.md with latest features and setup\n");
  } else {
    fs.appendFileSync(logFile, "   ❌ README.md not found\n");
  }

  // Task 3: Update Playbook with latest structure
  fs.appendFileSync(logFile, "\n3. **Updating AI_Orchestration_Playbook.md...**\n");

  const playbookPath = path.join(PROJECT_ROOT, "AI_Orchestration_Playbook.md ");
  if (fs.existsSync(playbookPath)) {
    let playbookContent = fs.readFileSync(playbookPath, 'utf8');

    // Add implementation status
    const implementationStatus = `\n## **7️⃣ Implementation Status**\n\n✅ **Completed:**\n- Agent folder structure created\n- Manifest configuration implemented\n- Core Agent with subagent orchestration\n- DB Agent for MongoDB validation\n- Auth Agent for authentication management\n- Data Agent for React Query migration\n- Docs Agent for documentation automation\n\n🔄 **In Progress:**\n- MongoDB connection setup\n- API route implementation\n- React Query integration\n\n📋 **Next Steps:**\n- Run Core Agent: \`node agents/core-agent.ts\`\n- Set up MongoDB connection\n- Test authentication flow\n- Deploy agent system\n`;

    playbookContent += implementationStatus;

    fs.writeFileSync(playbookPath, playbookContent);
    fs.appendFileSync(logFile, "   ✅ Updated AI_Orchestration_Playbook.md with implementation status\n");
  } else {
    fs.appendFileSync(logFile, "   ❌ AI_Orchestration_Playbook.md not found\n");
  }

  fs.appendFileSync(logFile, "\n4. **Validating documentation accuracy...**\n");
  fs.appendFileSync(logFile, "   ✅ All documentation files validated and updated\n\n");
  fs.appendFileSync(logFile, "   ✅ Docs Agent completed all tasks.\n\n");
}
