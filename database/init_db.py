#!/usr/bin/env python3
"""
Database Initialization Script for BiteBase
This script connects to the PostgreSQL database and applies the schema.sql file
"""

import os
import sys
import subprocess
import time

def run_command(command):
    """Run a shell command and return output"""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return False
    print(result.stdout)
    return True

def main():
    """Initialize the BiteBase database"""
    print("Initializing BiteBase database...")
    
    # Check if the PostgreSQL container is running
    if not run_command("docker ps | grep bitebase-postgres"):
        print("PostgreSQL container is not running. Starting it...")
        run_command("docker run -d --name bitebase-postgres -e POSTGRES_DB=bitebase -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgis/postgis:15-3.3")
        print("Waiting for PostgreSQL to start...")
        time.sleep(10)  # Wait for PostgreSQL to start
    
    # Copy schema.sql to the container
    script_dir = os.path.dirname(os.path.abspath(__file__))
    schema_path = os.path.join(script_dir, 'schema.sql')
    
    if not run_command(f"docker cp {schema_path} bitebase-postgres:/tmp/schema.sql"):
        print("Failed to copy schema.sql to container")
        return
    
    # Execute the schema.sql file
    if not run_command("docker exec bitebase-postgres psql -U postgres -d bitebase -f /tmp/schema.sql"):
        print("Failed to execute schema.sql")
        return
    
    # Verify that tables were created
    if not run_command("docker exec bitebase-postgres psql -U postgres -d bitebase -c '\\dt'"):
        print("Failed to verify table creation")
        return
    
    print("Database initialization complete!")

if __name__ == "__main__":
    main() 