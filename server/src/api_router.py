from flask import Flask, jsonify, Blueprint, request
from src.services.database_service import DatabaseService
from src.utilities.url_generator import get_new_url, is_existing_url, is_valid_url

api = Blueprint('api', __name__, url_prefix='/api')

database = DatabaseService()

@api.get("/bins/generate")
def generate_bin_url():
  return get_new_url()

@api.get("/bins")
def get_all_bins():
    bins = database.get_all_bins()
    return jsonify(bins)

@api.post("/bins")
def create_new_bin():
    data = request.get_json()
    requested_url = data.get('url')
    print("requested_url", requested_url)
    print("data", data)
    if (is_valid_url(requested_url)):
        print("here")
        new_bin = database.create_bin(requested_url)
        print("new_bin", new_bin)
        return jsonify(new_bin)
    elif (is_existing_url(requested_url)):
        return jsonify('That URL is already in use.'), 400
    else:
        return jsonify("Invalid URL. Must be 7-10 characters using only characters 0-9 and a-Z.")

@api.get("/bins/<string:bin_url>/requests")
def get_bin_requests(bin_url):
    if (is_existing_url(bin_url)):
        requests = database.get_bin_requests(bin_url)
        return jsonify(requests)
    else:
        return jsonify("Invalid URL. Bin not found."), 400

@api.delete("/bins/<string:bin_url>")
def delete_bin(bin_url):
    if (is_existing_url(bin_url)):
        result = database.delete_bin(bin_url)
        return {}
    else:
        return jsonify("Invalid URL. Bin not found."), 400

@api.delete("/bins/<string:bin_url>/requests/all")
def burn_bin_requests(bin_url):
    if (is_existing_url(bin_url)):
        database.delete_bin_requests(bin_url)
        return {}
    else:
        return jsonify("Invalid URL. Bin not found."), 400

# @api.delete("bins/<string:url>/requests/<string:request_id>")
# def delete_request(request_id):
#     # database.delete_one_request(request_id)
