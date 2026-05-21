#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f ".env" ]; then
  echo "Loading environment variables from .env..."
  set -a
  source .env
  set +a
fi

# Set PYTHONPATH to the current directory to ensure backend modules are findable
export PYTHONPATH=$PYTHONPATH:.

# Prefer the Python 3.11 venv if available
if [ -x ".venv311/bin/uvicorn" ]; then
  UVICORN_CMD=".venv311/bin/uvicorn"
else
  UVICORN_CMD="uvicorn"
fi

# Start the backend server using uvicorn
echo "Starting the backend server with $UVICORN_CMD..."
$UVICORN_CMD backend.src.main:app --host 0.0.0.0 --port 8000 --reload
