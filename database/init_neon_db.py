#!/usr/bin/env python3
"""
Database Initialization Script for BiteBase (Neon.tech)
This script connects to the Neon.tech PostgreSQL database and applies the schema.sql file
"""

import os
import sys
import psycopg2
from psycopg2 import sql

# Connection string
CONNECTION_STRING = "postgresql://bitebasedb_staging_owner:npg_vzp02ERAaXoQ@ep-damp-tooth-a4orgq86-pooler.us-east-1.aws.neon.tech/bitebasedb_staging?sslmode=require"

def main():
    """Initialize the BiteBase database on Neon.tech"""
    print("Initializing BiteBase database on Neon.tech...")
    
    try:
        # Connect to the database
        print("Connecting to database...")
        conn = psycopg2.connect(CONNECTION_STRING)
        
        # Create a cursor
        cur = conn.cursor()
        
        # Check connection
        cur.execute("SELECT 1")
        result = cur.fetchone()
        print(f"Connection successful: {result[0]}")
        
        # List existing tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        existing_tables = cur.fetchall()
        
        if existing_tables:
            print("Existing database tables:")
            for table in existing_tables:
                print(f"  - {table[0]}")
            
            confirm = input("Tables already exist. Do you want to drop and recreate them? (y/n): ")
            if confirm.lower() != 'y':
                print("Aborted. No changes made to the database.")
                cur.close()
                conn.close()
                return 0
            
            # Drop existing tables
            print("Dropping existing tables...")
            for table in existing_tables:
                cur.execute(sql.SQL("DROP TABLE IF EXISTS {} CASCADE").format(sql.Identifier(table[0])))
            conn.commit()
        
        # Read schema.sql
        script_dir = os.path.dirname(os.path.abspath(__file__))
        schema_path = os.path.join(script_dir, 'schema.sql')
        
        print(f"Applying schema from {schema_path}...")
        with open(schema_path, "r") as f:
            schema_sql = f.read()
        
        # Execute schema
        cur.execute(schema_sql)
        conn.commit()
        
        # Verify tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        
        if tables:
            print("Database tables created successfully:")
            for table in tables:
                print(f"  - {table[0]}")
                
                # Count rows in the table
                cur.execute(sql.SQL("SELECT COUNT(*) FROM {}").format(sql.Identifier(table[0])))
                count = cur.fetchone()[0]
                print(f"    Rows: {count}")
        else:
            print("No tables were created. Check for errors.")
        
        # Close cursor and connection
        cur.close()
        conn.close()
        
        print("Database initialization complete!")
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 