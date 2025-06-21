from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib.parse import parse_qs
from sportevents_db import SportEventsDB

# make sure this works
# read the homework assignment and name the data



class MyRequestHandler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        print("The PATH is:", self.path)
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers","Content-Type, Content-Length")
        self.end_headers()

    def do_GET(self):
        print("The PATH is:", self.path)
        if self.path == "/sports":
            self.RetrieveSportEvents()
        elif self.path.startswith("/sports/"):
            self.RetrieveOneEvent()
        else:
            self.handleNotFound()
            
    def do_POST(self):
        if self.path == "/sports":
            self.handleCreateSportEvents()
        else:
            self.handleNotFound()
    
    def do_DELETE(self):
        if self.path.startswith("/sports/"):
            self.HandleDeleteOneEvent()

        else:
            self.handleNotFound()

    def do_PUT(self):
        if self.path.startswith("/sports/"):
            self.handleUpdateOneEvent()
        else:
            self.handleNotFound()


    def handleNotFound(self):
        self.send_response(404, "Error, page not found")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()


    def RetrieveSportEvents(self):
        # respond accordingly
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")

        # allow acces the over to other servers
        self.end_headers()

        # read from the database
        db = SportEventsDB()
        sports = db.getSportsEvents()

        # send a body
        self.wfile.write(bytes(json.dumps(sports), "utf-8"))


    def RetrieveOneEvent(self):
        parts = self.path.split("/")
        sports_id = parts[2]
        db = SportEventsDB()
        sport = db.getOneSportEvent(sports_id)

        if sport != None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(sport), "utf-8"))
        else:
            self.handleNotFound()


    def handleCreateSportEvents(self):
        
	    # get the content length (in bytes)
            length = self.headers["Content-Length"]

            # read the body to a string
            body = self.rfile.read(int(length)).decode("utf-8")
            print("Body: ", body)
            # print the body as a string
            
            parsed_body = parse_qs(body)
            print("parsed body", parsed_body)

            league = parsed_body["league"][0]  #copy each for column heading 
            teamname = parsed_body["teamname"][0]
            conferance = parsed_body["conferance"][0]
            teamrank = parsed_body["teamrank"][0]
            location = parsed_body["location"][0]
            mascot = parsed_body["mascot"][0]


            db = SportEventsDB()      
            db.insertSportsEvent(league,teamname,conferance,teamrank,location,mascot)

            # respond to the client
            self.send_response(201)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

    def handleUpdateOneEvent(self):
        parts = self.path.split("/")
        sports_id = parts[2]
        db = SportEventsDB()
        sport = db.getOneSportEvent(sports_id)

        if sport != None:

            # respond to the client
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(sport), "utf-8"))

            length = self.headers["Content-Length"]

            # read the body to a string
            body = self.rfile.read(int(length)).decode("utf-8")
            print("Body: ", body)
            # print the body as a string
            
            parsed_body = parse_qs(body)
            print("parsed body", parsed_body)

            league = parsed_body["league"][0]  #copy each for column heading 
            teamname = parsed_body["teamname"][0]
            conferance = parsed_body["conferance"][0]
            teamrank = parsed_body["teamrank"][0]
            location = parsed_body["location"][0]
            mascot = parsed_body["mascot"][0]
   
            db.UpdateSportEvent(league,teamname,conferance,teamrank,location,mascot,sports_id)

            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

        else:
            self.handleNotFound()

    # get the content length (in bytes)



    def HandleDeleteOneEvent(self):  
        parts = self.path.split("/")
        sport_id = parts[2]
        db = SportEventsDB()
        sport = db.getOneSportEvent(sport_id)

        if sport != None:
            db.DeleteSportEvent(sport_id)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
        else:
            self.handleNotFound()


def run():

    listen=("127.0.0.1", 8080)
    server=HTTPServer(listen, MyRequestHandler)

    print("Listening....")
    server.serve_forever()

run()











