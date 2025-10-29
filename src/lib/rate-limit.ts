type RateLimitEntry = {
  count: number;
  resetTime: number;
};

class InMemoryRateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  private startCleanup() {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.requests.entries()) {
        if (now > entry.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 60000);
  }

  async limit(
    identifier: string,
    options: { requests: number; window: number }
  ): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      const resetTime = now + options.window;
      this.requests.set(identifier, { count: 1, resetTime });
      return {
        success: true,
        remaining: options.requests - 1,
        reset: resetTime,
      };
    }

    if (entry.count >= options.requests) {
      return {
        success: false,
        remaining: 0,
        reset: entry.resetTime,
      };
    }

    entry.count++;
    return {
      success: true,
      remaining: options.requests - entry.count,
      reset: entry.resetTime,
    };
  }

  cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }
}

export const rateLimiter = new InMemoryRateLimiter();

export const rateLimitConfig = {
  tasks: { requests: 10, window: 10000 },
  journal: { requests: 10, window: 10000 },
  rewards: { requests: 5, window: 10000 },
  default: { requests: 20, window: 10000 },
} as const;
