from flask import jsonify
from pymongo import MongoClient
import psycopg2
from bson.objectid import ObjectId
from src.services.psql_service import PsqlServices

class DatabaseService:
    def __init__(self):
        self.mongo_client = MongoClient('mongodb://localhost:27017/')
        self.mongo_db = self.mongo_client['RequestBin']
        self.connection = PsqlServices.get_connection()

    def get_paths(self):
        query = """
        SELECT path FROM bins;
        """

        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                result = cursor.fetchall()

        return result

    def get_all_bins(self):
        query = f"""
        SELECT path FROM bins;
        """

        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                result = cursor.fetchall()

        return result

    def create_bin(self, bin_url):
        query = f"""
        INSERT INTO Bins (path) VALUES ('{bin_url}');
        """

        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(query)

        return bin_url

    def get_bin_requests(self, bin_url):
        query = f"""
        SELECT requests.mongodb_doc_id
        FROM requests
        LEFT JOIN bins ON requests.bin_id = bins.id
        WHERE bins.path = '{bin_url}';
        """
        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                result = cursor.fetchall()

        flattened_list = [mongodb_doc_id_arr[0] for mongodb_doc_id_arr in result]
        requests_list = [self.mongo_db.Requests.find_one({"_id": ObjectId(mongo_id)}) for mongo_id in flattened_list]
        for request in requests_list:
            del request["_id"]

        return requests_list

    def delete_bin(self, bin_url):
        query = f"""
        DELETE FROM bins WHERE path = '{bin_url}';
        """

        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                rows_deleted = cursor.rowcount
        return f"{rows_deleted} bin(s) deleted in this operation."

    def get_collection(self, collection_name):
        return self.mongo_db[collection_name]

    def write_req(self, payload):
        path = payload["bin_url"]
        mongo_db_object_id = self.get_collection("Requests").insert_one(payload)

        query1 = f"""
        SELECT id FROM bins WHERE path = '{path}';
        """

        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(query1)
                result = cursor.fetchall()

        query2 = f"""
        INSERT INTO requests (bin_id, mongodb_doc_id)
        VALUES ('{result[0][0]}' , '{mongo_db_object_id.inserted_id}');
        """

        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(query2)


        return mongo_db_object_id.inserted_id

    def delete_bin_requests(self, bin_url):
        query = f"""
        DELETE FROM requests
        WHERE bin_id IN (
          SELECT id FROM bins
          WHERE path = '{bin_url}'
        );
        """

        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                rows_deleted = cursor.rowcount

        return f"{rows_deleted} request(s) deleted in this operation."