#!/bin/bash

# Initialize the BiteBase database on Neon.tech
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

echo "🚀 Initializing BiteBase database on Neon.tech..."

# Check if psycopg2-binary is installed
if ! python3 -c "import psycopg2" &>/dev/null; then
    echo "📦 Installing required package: psycopg2-binary..."
    pip install psycopg2-binary
fi

# Run the initialization script
if [ "$1" == "--force" ]; then
    echo "⚠️  Force mode enabled. Existing tables will be dropped and recreated."
    python3 database/init_neon_db_auto.py --force
else
    python3 database/init_neon_db_auto.py
fi

# Exit with the same status as the Python script
exit $? 