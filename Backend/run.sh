#!/bin/bash
echo "Starting HyperWatch Backend..."
echo ""
echo "Make sure you have:"
echo "1. Installed dependencies: pip install -r requirements.txt"
echo "2. MongoDB is running"
echo "3. Updated .env file with your configuration"
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
