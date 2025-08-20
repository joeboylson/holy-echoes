#!/bin/bash

# Script to push schema to Instant CLI with the appropriate app ID
# Usage: ./push-schema.sh [--production]

set -e

ENV_FILE=".env"

# Check if --production flag is passed
if [ "$1" == "--production" ]; then
    ENV_FILE=".env.production"
fi

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE file not found!"
    exit 1
fi

# Read VITE_INSTANT_APP_ID from the environment file
APP_ID=$(grep "VITE_INSTANT_APP_ID" "$ENV_FILE" | cut -d '=' -f2)

# Check if APP_ID was found
if [ -z "$APP_ID" ]; then
    echo "Error: VITE_INSTANT_APP_ID not found in $ENV_FILE"
    exit 1
fi

echo "Using app ID: $APP_ID from $ENV_FILE"
echo "Running: npx instant-cli@latest push schema --app $APP_ID"

# Run the instant-cli command
npx instant-cli@latest push schema --app "$APP_ID"