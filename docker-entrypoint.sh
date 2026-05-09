#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/app"
cd "$APP_DIR"

# If .env already exists, leave it alone
if [ -f .env ]; then
  echo ".env already present"
else
  if [ -f .env.example ]; then
    echo "Generating .env from .env.example and environment variables"
    # Build a new .env by reading keys from .env.example
    > .env.tmp
    while IFS= read -r line || [ -n "$line" ]; do
      # Skip comments and empty lines
      [[ "$line" =~ ^# ]] && continue
      [[ -z "$line" ]] && continue
      key="${line%%=*}"
      # If environment variable exists, use it; otherwise use example value
      if [ -n "${!key-}" ]; then
        printf "%s=%s\n" "$key" "${!key}" >> .env.tmp
      else
        # preserve the example's value (everything after first '=')
        val="${line#*=}"
        printf "%s=%s\n" "$key" "$val" >> .env.tmp
      fi
    done < .env.example
    mv .env.tmp .env
    echo ".env generated"
  else
    echo ".env.example not found; skipping .env generation"
  fi
fi

# Start the application
exec node dist/index.js
