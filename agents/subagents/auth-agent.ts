import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(__dirname, "../..");

export default async function AuthAgent(logFile: string) {
  fs.appendFileSync(logFile, "### Auth Agent Tasks\n\n");

  // Task 1: Check protected routes for auth bypass
  fs.appendFileSync(logFile, "1. **Checking protected routes for auth bypass...**\n");

  const protectedRoutes = [
    "src/app/dashboard/page.tsx",
    "src/app/tasks/page.tsx",
    "src/app/journal/page.tsx",
    "src/app/calendar/page.tsx",
    "src/app/affirmations/page.tsx",
    "src/app/rewards/page.tsx"
  ];

  let authBypassed = false;

  protectedRoutes.forEach(route => {
    const routePath = path.join(PROJECT_ROOT, route);
    if (fs.existsSync(routePath)) {
      const content = fs.readFileSync(routePath, 'utf8');

      if (content.includes("// TEMPORARY: Bypass auth for development") ||
          content.includes("useSession") === false) {
        fs.appendFileSync(logFile, `   ⚠️ ${route} has auth bypassed or missing.\n`);
        authBypassed = true;
      } else {
        fs.appendFileSync(logFile, `   ✅ ${route} has proper auth.\n`);
      }
    } else {
      fs.appendFileSync(logFile, `   ❌ ${route} does not exist.\n`);
    }
  });

  if (authBypassed) {
    fs.appendFileSync(logFile, "\n   ⚠️ Authentication is currently bypassed for development.\n");
    fs.appendFileSync(logFile, "   💡 To re-enable: Remove bypass comments in /src/app/dashboard/page.tsx\n");
    fs.appendFileSync(logFile, "   💡 Set up Google OAuth credentials and MongoDB connection\n");
  } else {
    fs.appendFileSync(logFile, "   ✅ All routes have proper authentication.\n");
  }

  // Task 2: Check NextAuth configuration
  fs.appendFileSync(logFile, "\n2. **Checking NextAuth configuration...**\n");

  const authRoutePath = path.join(PROJECT_ROOT, "src/app/api/auth/[...nextauth]/route.ts");
  if (fs.existsSync(authRoutePath)) {
    const content = fs.readFileSync(authRoutePath, 'utf8');

    if (content.includes("// adapter: MongoDBAdapter(clientPromise)")) {
      fs.appendFileSync(logFile, "   ⚠️ MongoDB adapter is commented out.\n");
      fs.appendFileSync(logFile, "   💡 Re-enable when MongoDB is properly configured.\n");
    } else if (content.includes("MongoDBAdapter(clientPromise)")) {
      fs.appendFileSync(logFile, "   ✅ MongoDB adapter is enabled.\n");
    } else {
      fs.appendFileSync(logFile, "   ⚠️ No MongoDB adapter found.\n");
    }

    if (content.includes("GoogleProvider")) {
      fs.appendFileSync(logFile, "   ✅ Google OAuth provider configured.\n");
    } else {
      fs.appendFileSync(logFile, "   ❌ Google OAuth provider missing.\n");
    }
  } else {
    fs.appendFileSync(logFile, "   ❌ NextAuth route not found.\n");
  }

  // Task 3: Check environment variables
  fs.appendFileSync(logFile, "\n3. **Checking environment variables...**\n");

  const requiredEnvVars = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL"
  ];

  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      fs.appendFileSync(logFile, `   ✅ ${envVar} is set.\n`);
    } else {
      fs.appendFileSync(logFile, `   ❌ ${envVar} is missing.\n`);
    }
  });

  fs.appendFileSync(logFile, "\n   ✅ Auth Agent completed all tasks.\n\n");
}
