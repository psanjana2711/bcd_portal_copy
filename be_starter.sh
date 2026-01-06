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

# Start the backend server using uvicorn
echo "Starting the backend server..."
uvicorn backend.src.main:app --host 0.0.0.0 --port 8000 --reload
