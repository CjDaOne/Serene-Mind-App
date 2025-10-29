# Database Setup Guide

## MongoDB Configuration

### Environment Variables

Add these to your `.env.local` (development) or Vercel environment variables (production):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=serene-mind
```

### Connection Pool Settings

The MongoDB client is **optimized for Vercel serverless functions** with aggressive connection pooling:

- **maxPoolSize**: 1 connection (each serverless function instance maintains its own connection)
- **minPoolSize**: 0 connections (no minimum to reduce idle connections)
- **maxIdleTimeMS**: 10 seconds (close idle connections quickly)
- **serverSelectionTimeoutMS**: 5 seconds (faster timeout for cold starts)
- **connectTimeoutMS**: 10 seconds (connection timeout)
- **socketTimeoutMS**: 45 seconds

**Why these settings?** In Vercel's serverless environment, each function instance manages its own connection pool. Setting `maxPoolSize` too high (e.g., 10) across many concurrent function instances can exhaust MongoDB Atlas connection limits. With `maxPoolSize: 1`, we ensure optimal resource usage while preventing connection pool exhaustion.

### Database Indexes

Indexes are automatically created on first database access. Manual creation via API:

```bash
# Development only
curl http://localhost:3001/api/db-init
```

#### Index Specifications

1. **tasks collection**
   - Index: `{ userId: 1, createdAt: -1 }`
   - Purpose: Fast user task queries sorted by creation date

2. **journal collection**
   - Index: `{ userId: 1, date: -1 }`
   - Purpose: Fast user journal queries sorted by date

3. **rewards collection**
   - Index: `{ userId: 1 }`
   - Purpose: Fast user rewards lookup

### Production Deployment

#### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster (free M0 tier works)
2. Create a database user with read/write access
3. Add your deployment IP to Network Access (or use 0.0.0.0/0 for Vercel)
4. Get connection string from Atlas dashboard
5. Add `MONGODB_URI` to Vercel environment variables

#### Vercel Environment Variables

```
MONGODB_URI=mongodb+srv://...
MONGODB_DB=serene-mind
```

#### Production Connection Pooling

In production (Vercel), each serverless function creates its own MongoDB client with:
- **1 connection max per function instance** - prevents pool exhaustion
- **0 minimum connections** - reduces idle connections during low traffic
- **10s idle timeout** - aggressively closes unused connections

This configuration is critical for MongoDB Atlas free tier (M0) which has a 500 connection limit. Without optimization, concurrent serverless functions can quickly exhaust available connections.

### Monitoring

Connection errors are logged to console:
```
MongoDB connection error: [error details]
```

### Best Practices

1. **Connection Reuse**: The connection is cached globally in development and reused across requests
2. **Error Handling**: All database operations include try/catch with logging
3. **Serverless Optimization**: Connection pooling is tuned for Vercel's serverless functions
4. **Index Background Creation**: Indexes are created with `background: true` to avoid blocking
5. **Database Isolation**: Use `MONGODB_DB` to separate dev/staging/prod databases

### Troubleshooting

**Connection timeout**: Increase `serverSelectionTimeoutMS` in `src/lib/mongodb.ts`

**Too many connections**: Reduce `maxPoolSize` if hitting Atlas limits

**Slow queries**: Check indexes are created with:
```javascript
db.tasks.getIndexes()
db.journal.getIndexes()
```

**Database not found**: Verify `MONGODB_DB` environment variable is set
