import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

class Database:
    def __init__(self):
        connection_string = (
            f"host={os.getenv('DB_HOST')} "
            f"port={os.getenv('DB_PORT')} "
            f"dbname={os.getenv('DB_NAME')} "
            f"user={os.getenv('DB_USER')} "
            f"password={os.getenv('DB_PASSWORD')} "
            f"connect_timeout={os.getenv('DB_CONNECT_TIMEOUT')} "
        )

        self.conn = psycopg2.connect(connection_string)
        self.cursor = self.conn.cursor()

    def execute_query(self, query, params=None):
        try:
            self.cursor.execute(query, params)
            if query.strip().lower().startswith("select"):
                return self.cursor.fetchall()
            self.conn.commit()  # Commit only if there was no error
        except Exception as e:
            self.conn.rollback()  # Rollback to fix failed transaction
            print(f"Database Error: {e}")
            raise e
        
    def execute_non_query(self, query, params=None):
        try:
            """ Execute INSERT, UPDATE, DELETE queries. """
            self.cursor.execute(query, params)
            self.conn.commit()
            return True
        except Exception as e:
            self.conn.rollback()
            print(f"Error executing query: {e}")
            return False

    def close(self):
        """ Close database connection. """
        self.cursor.close()
        self.conn.close()
