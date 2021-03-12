from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
from restaurants_db import RestaurantsDB
import json

class MyRequestHandler(BaseHTTPRequestHandler):

  def do_GET(self):
    if self.path == "/restaurants":
      self.handleRestaurantsRetrieve()
    elif self.path.startswith("/restaurants/"):
      self.handleRestaurantRetrieve()
    else:
      self.handleNotFound()

  def do_POST(self):
    if self.path == "/restaurants":
      # read the body (data)
      length = self.headers["Content-Length"]
      body = self.rfile.read(int(length)).decode("utf-8")
      print("BODY:", body)

      # parse the body string into a dictionary using parse_qs()
      parsed_body = parse_qs(body)
      print("PARSED BODY:", parsed_body)

      # save the restaurant into the database
      name = parsed_body["name"][0]
      cuisine = parsed_body["cuisine"][0]
      hours = parsed_body["hours"][0]
      rating = parsed_body["rating"][0]

      db = RestaurantsDB()
      db.insertRestaurant(name, cuisine, hours, rating)

      # respond to the client
      self.send_response(201)
      self.send_header("Access-Control-Allow-Origin", "*")
      self.end_headers()
    else:
      self.handleNotFound()


  def handleNotFound(self):
    self.send_response(404)
    self.end_headers()
    self.wfile.write(bytes("Not found.", "utf-8"))

  def handleRestaurantsRetrieve(self):
    # respond accordingly
    self.send_response(200)
    self.send_header("Content-Type", "application/json")
    self.send_header("Access-Control-Allow-Origin", "*")
    self.end_headers()
    # send a body
    db = RestaurantsDB()
    restaurants = db.getRestaurants()
    self.wfile.write(bytes(json.dumps(restaurants), "utf-8"))

  def handleRestaurantRetrieve(self):
    parts = self.path.split("/")
    restaurant_id = parts[2]

    db = RestaurantsDB()
    restaurant = db.getOneRestaurant(restaurant_id)

    if restaurant != None:
      self.send_response(200)
      self.send_header("Content-Type", "application/json")
      self.send_header("Access-Control-Allow-Origin", "*")
      self.end_headers()
      self.wfile.write(bytes(json.dumps(restaurant), "utf-8"))
    else:
      self.handleNotFound()

  def handleRestaurantCreate(self):
    pass

def run():
  listen = ("127.0.0.1", 8080)
  server = HTTPServer(listen, MyRequestHandler)

  print("Listening...")
  server.serve_forever()

run()
