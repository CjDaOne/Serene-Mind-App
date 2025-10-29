# Database Setup Guide

## MongoDB Configuration

### Environment Variables

Add these to your `.env.local` (development) or Vercel environment variables (production):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=serene-mind
```

### Connection Pool Settings

The MongoDB client is optimized for serverless (Vercel) with:
- **maxPoolSize**: 10 connections
- **minPoolSize**: 2 connections
- **maxIdleTimeMS**: 60 seconds
- **serverSelectionTimeoutMS**: 10 seconds
- **socketTimeoutMS**: 45 seconds

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
