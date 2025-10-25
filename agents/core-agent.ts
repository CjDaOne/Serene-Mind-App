import fs from "fs";
import path from "path";
import dbAgent from "./subagents/db-agent";
import authAgent from "./subagents/auth-agent";
import dataAgent from "./subagents/data-agent";
import docsAgent from "./subagents/docs-agent";

const logFile = path.join(__dirname, "logs", "agent-log.md");

async function CoreAgent() {
  console.log("🚀 Starting SereneMind Core Agent...");

  // Initialize log file
  const timestamp = new Date().toISOString();
  fs.writeFileSync(logFile, `# SereneMind Core Agent Log\n\nStarted at: ${timestamp}\n\n`);

  console.log("📋 Executing subagents...\n");

  try {
    // Execute DB Agent
    console.log("🔧 Starting DB Agent...");
    fs.appendFileSync(logFile, "## DB Agent Execution\n\n");
    await dbAgent(logFile);
    console.log("✅ DB Agent completed\n");

    // Execute Auth Agent
    console.log("🔐 Starting Auth Agent...");
    fs.appendFileSync(logFile, "\n## Auth Agent Execution\n\n");
    await authAgent(logFile);
    console.log("✅ Auth Agent completed\n");

    // Execute Data Agent
    console.log("📊 Starting Data Agent...");
    fs.appendFileSync(logFile, "\n## Data Agent Execution\n\n");
    await dataAgent(logFile);
    console.log("✅ Data Agent completed\n");

    // Execute Docs Agent
    console.log("📚 Starting Docs Agent...");
    fs.appendFileSync(logFile, "\n## Docs Agent Execution\n\n");
    await docsAgent(logFile);
    console.log("✅ Docs Agent completed\n");

    // Final summary
    const completionTime = new Date().toISOString();
    fs.appendFileSync(logFile, `\n---\n\n## Summary\n\n✅ All agents completed successfully at ${completionTime}\n\n`);
    fs.appendFileSync(logFile, "### Next Steps:\n");
    fs.appendFileSync(logFile, "- Review agent logs for any issues\n");
    fs.appendFileSync(logFile, "- Check updated documentation\n");
    fs.appendFileSync(logFile, "- Test application functionality\n");
    fs.appendFileSync(logFile, "- Commit changes to repository\n");

    console.log("🎉 All subagents completed successfully!");
    console.log(`📄 Check logs at: ${logFile}`);

  } catch (error) {
    console.error("❌ Core Agent execution failed:", error);
    fs.appendFileSync(logFile, `\n❌ ERROR: ${error}\n`);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  CoreAgent();
}

export default CoreAgent;
