import { rateLimiter, rateLimitConfig } from '../src/lib/rate-limit';

async function testRateLimit() {
  console.log('🧪 Testing Rate Limiter\n');

  const testId = 'test-user-123';
  const config = rateLimitConfig.tasks;

  console.log(`Config: ${config.requests} requests per ${config.window}ms\n`);

  console.log('Making requests...');
  for (let i = 1; i <= 12; i++) {
    const result = await rateLimiter.limit(testId, config);
    const status = result.success ? '✅' : '❌';
    console.log(
      `${status} Request ${i}: success=${result.success}, remaining=${result.remaining}`
    );
  }

  console.log('\n⏳ Waiting for rate limit window to reset...');
  await new Promise((resolve) => setTimeout(resolve, config.window + 100));

  console.log('\n🔄 Testing after reset:');
  const afterReset = await rateLimiter.limit(testId, config);
  console.log(
    `✅ Request after reset: success=${afterReset.success}, remaining=${afterReset.remaining}`
  );

  console.log('\n🎉 Rate limiting test complete!');
  
  rateLimiter.cleanup();
  process.exit(0);
}

testRateLimit().catch(console.error);
