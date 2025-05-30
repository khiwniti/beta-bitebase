#!/usr/bin/env python3
"""
Simple script to check the database connection
"""

import psycopg2
import sys

def main():
    """Check database connection and report status"""
    print("Checking database connection...")
    
    try:
        # Connect to the database
        conn = psycopg2.connect(
            host="localhost",
            database="bitebase",
            user="postgres",
            password="password",
            port=5432
        )
        
        # Create a cursor
        cur = conn.cursor()
        
        # Execute a simple query
        cur.execute("SELECT 1")
        result = cur.fetchone()
        print(f"Connection successful: {result[0]}")
        
        # List tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        
        if tables:
            print("Database tables:")
            for table in tables:
                print(f"  - {table[0]}")
        else:
            print("No tables found. Database needs initialization.")
            # Create tables if they don't exist
            print("Initializing database...")
            
            # Read schema.sql
            with open("database/schema.sql", "r") as f:
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
            print("Tables created:")
            for table in tables:
                print(f"  - {table[0]}")
        
        # Close cursor and connection
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 