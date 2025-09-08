#!/bin/bash
echo "Resetting database..."

# Stop backend if running
pkill -f "npm run start:dev" || true

# Reset PostgreSQL
cd ../
docker-compose stop postgres
docker-compose rm -f postgres
docker volume rm getshub_postgres_data || true
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
sleep 5

echo "Database reset complete. You can now start the backend."