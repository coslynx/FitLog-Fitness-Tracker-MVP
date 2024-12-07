#!/bin/bash

set -euo pipefail

# Load environment variables
[ -f .env ] && source .env

# Validate environment variables
required_vars=("DATABASE_URL" "JWT_SECRET" "PORT")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: Environment variable '$var' not set." >&2
    exit 1
  fi
done

# MongoDB Connection
mongod --dbpath /data/db &
mongod_pid=$!
trap "kill $mongod_pid; exit" ERR INT TERM EXIT

# Wait for MongoDB
wait_for_service mongodb 30 1

#Start Backend Server
node server.js &
backend_pid=$!
trap "kill $backend_pid; exit" ERR INT TERM EXIT

# Wait for Backend
wait_for_service backend 60 1


echo "Fitness Tracker MVP started successfully."
echo "Backend Server: http://localhost:${PORT}"