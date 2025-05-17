import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

class PsqlServices:
  def get_connection():
    return psycopg2.connect(
      dbname=os.getenv('POSTGRES_DB', 'request_bin'),
      user=os.getenv('POSTGRES_USER', 'postgres'),
      password=os.getenv('POSTGRES_PASSWORD', ''),
      host=os.getenv('POSTGRES_HOST', 'localhost')
    )

  def get_bins():
    connection = PsqlServices.get_connection()

    try:
      with connection:
        with connection.cursor() as cursor:
          cursor.execute("SELECT mongodb_doc_id FROM request")
          result = cursor.fetchall()
    finally:
      connection.close()

    return result

  def get_bin_id(url):
    connection = PsqlServices.get_connection()

    try:
      with connection:
        with connection.cursor() as cursor:
          cursor.execute("SELECT id FROM Bin WHERE path=%s", (url,))
          result = cursor.fetchone()
    finally:
      connection.close()

    return result