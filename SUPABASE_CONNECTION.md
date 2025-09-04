# Supabase Connection Guide

This guide explains the exact process to connect to Supabase databases using psql.

## Working Connection Method

### Session Pooler Connection (Recommended)

Use this connection string format with the session pooler:

```bash
PGPASSWORD='your-password' psql "postgresql://postgres.projectid:your-password@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
```

**Example for this project:**
```bash
PGPASSWORD='o78KArCqK4rvrQcX' psql "postgresql://postgres.vaoeflfloctjoqnmtsuw:o78KArCqK4rvrQcX@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

### Connection String Components

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

- **USERNAME**: `postgres.projectid` (note the dot separator)
- **PASSWORD**: Your database password (case-sensitive)
- **HOST**: `aws-1-us-east-1.pooler.supabase.com` (or your region)
- **PORT**: `5432`
- **DATABASE**: `postgres`

## Getting Your Connection Details

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **Database**  
4. Under **Connection String**, select **Session pooler**
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual password

## Common Connection Commands

### Test Connection
```bash
PGPASSWORD='your-password' psql "postgresql://postgres.projectid:password@aws-1-region.pooler.supabase.com:5432/postgres" -c "SELECT 1;"
```

### Run Single Query
```bash
PGPASSWORD='your-password' psql "postgresql://..." -c "SELECT * FROM your_table;"
```

### Run SQL File
```bash
PGPASSWORD='your-password' psql "postgresql://..." -f migration.sql
```

### Multi-line Commands
```bash
PGPASSWORD='your-password' psql "postgresql://..." << 'EOF'
SELECT COUNT(*) FROM businesses;
SELECT id, name, category FROM businesses;
EOF
```

## Project-Specific Details

**Project ID**: `vaoeflfloctjoqnmtsuw`  
**Connection String**: 
```
postgresql://postgres.vaoeflfloctjoqnmtsuw:o78KArCqK4rvrQcX@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

## Troubleshooting

### Database Hibernation Error
If you get `{:shutdown, :db_termination}`, the database is waking up from hibernation. Wait 10-30 seconds and retry.

### Password Authentication Failed
- Verify password is exactly correct (case-sensitive)
- Don't URL-encode passwords when using PGPASSWORD method
- Ensure using `postgres.projectid` format for username

### Connection Refused
- Use session pooler (IPv4 compatible) instead of direct connection
- Verify project ID is correct
- Check if database is paused in Supabase dashboard

## Environment Variables

For application use, set these environment variables:

```bash
# Required for Supabase client
NEXT_PUBLIC_SUPABASE_URL=https://vaoeflfloctjoqnmtsuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhb2VmbGZsb2N0am9xbm10c3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTQxODcsImV4cCI6MjA3MjQzMDE4N30.DGJiihEFs8gR9II4935BWNX7eL3cUJOcm_VOZ81k2pk
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Direct database URL for migrations
DATABASE_URL=postgresql://postgres.vaoeflfloctjoqnmtsuw:o78KArCqK4rvrQcX@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```