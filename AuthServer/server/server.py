from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib.parse import parse_qs
from sportevents_db import SportEventsDB
from http import cookies
from passlib.hash import bcrypt
import hashlib
from SessionStore import SessionStore
import  sys

SESSION_STORE = SessionStore()

class MyRequestHandler(BaseHTTPRequestHandler):

    def end_headers(self):
        self.sendCookie()
        self.send_header("Access-Control-Allow-Origin",self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials","true")
        BaseHTTPRequestHandler.end_headers(self)

    # goal: load cookie into self.cookie
    def loadcookie(self):
        if "Cookie" in self.headers:
            self.cookie = cookies.SimpleCookie(self.headers["Cookie"])
        else:
            self.cookie = cookies.SimpleCookie()
        
    def sendCookie(self):
        for morsel in self.cookie.values():
            self.send_header("Set-Cookie",morsel.OutputString())

    # goal: load sessin into self.session
    def loadSession(self):
        self.loadcookie()
        # if session ID is in the cookie
        if "sessionId" in self.cookie:
            sessionId = self.cookie["sessionId"].value
            # save the session int self.sessin for use later
            self.session = SESSION_STORE.getSession(sessionId)
            # otherwise, if sessin ID is NOT in the session store
            if self.session == None:
                # create a new session
                sessionId = SESSION_STORE.createSession()
                self.session = SESSION_STORE.getSession(sessionId)
                # set the new session ID INTO the cookie
                self.cookie["sessionId"] = sessionId
        # otherwise, if session ID is NOT in the cookie
        else:
            # create a new session
            sessionId = SESSION_STORE.createSession()
            self.session = SESSION_STORE.getSession(sessionId)
            # set the new session ID INTO the cookie
            self.cookie["sessionId"] = sessionId


    def do_OPTIONS(self):
        self.loadSession()
        self.send_response(200)
        self.send_header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers","Content-Type, Content-Length")
        self.end_headers()

    def do_GET(self):
        self.loadSession()
        if self.path == "/sports":
            self.RetrieveSportEvents()
        elif self.path.startswith("/sports/"):
            self.RetrieveOneEvent()
        else:
            self.handleNotFound()
            
    def do_POST(self):
        self.loadSession()
        if self.path == "/sports":
            self.handleCreateSportEvents()
        elif self.path == "/users":
            self.handleCreateUsers()
        elif self.path == "/sessions":
            self.handleVerifyUser()
        else:
            self.handleNotFound()
    
    def do_DELETE(self):
        self.loadSession()
        if self.path.startswith("/sports/"):
            self.HandleDeleteOneEvent()
        else:
            self.handleNotFound()

    def do_PUT(self):
        self.loadSession()
        if self.path.startswith("/sports/"):
            self.handleUpdateOneEvent()
        else:
            self.handleNotFound()


    def handleNotFound(self):
        self.send_response(404, "Error, page not found")
        self.end_headers()

    def handleUnprocessableAction(self):
        self.send_response(422)
        self.end_headers()


    def RetrieveSportEvents(self):

        if "userid" not in self.session:
            self.handleNotAuthorized()
            return

        # respond accordingly
        self.send_response(200)
        self.send_header("Content-Type", "application/json")

        # allow acces the over to other servers
        self.end_headers()

        # read from the database
        db = SportEventsDB()
        sports = db.getSportsEvents()

        # send a body
        self.wfile.write(bytes(json.dumps(sports), "utf-8"))


    def RetrieveOneEvent(self):
                
        if "userid" not in self.session:
            self.handleNotAuthorized()
            return

        parts = self.path.split("/")
        sports_id = parts[2]
        db = SportEventsDB()
        sport = db.getOneSportEvent(sports_id)

        if sport != None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(sport), "utf-8"))
        else:
            self.handleNotFound()


    def handleCreateSportEvents(self):

        if "userid" not in self.session:
            self.handleNotAuthorized()
            return

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
        self.end_headers()

    def handleCreateUsers(self):
        db = SportEventsDB() 
        
    # get the content length (in bytes)
        length = self.headers["Content-Length"]

        # read the body to a string
        body = self.rfile.read(int(length)).decode("utf-8")
        print("Body: ", body)
        # print the body as a string
        
        parsed_body = parse_qs(body)
        print("parsed body", parsed_body)

        email = parsed_body["email"][0]  #copy each for column heading 
        fname = parsed_body["fname"][0]
        lname= parsed_body["lname"][0]
        req_password= parsed_body["password"][0]

        if db.getOneUserEmail(email) == None:

            encryptpassword = bcrypt.hash(req_password)
            db.insertUserRegistration(fname,lname,email,encryptpassword)
            # respond to the client
            self.send_response(201)
            self.end_headers()

        else:
            # status code 422
            self.handleUnprocessableAction()

    def handleVerifyUser(self):

        db = SportEventsDB() 
        
        # get the content length (in bytes)
        length = self.headers["Content-Length"]

        # read the body to a string
        body = self.rfile.read(int(length)).decode("utf-8")
        print("Body: ", body)
        # print the body as a string
        
        parsed_body = parse_qs(body)
        print("parsed body", parsed_body)

        email = parsed_body["email"][0]  #copy each for column heading 
        plain_password = parsed_body["password"][0]

        user = db.getOneUserEmail(email)
        
        if user != None:
            if bcrypt.verify(plain_password, user["encpass"]):
                id = user["id"]
                self.session["userid"] = id
                self.send_response(201)
                self.end_headers()
            else:
                # status code 401
                self.handleNotAuthorized()

        else:
            # status code 401
            self.handleNotAuthorized()

    def handleUpdateOneEvent(self):
        
        if "userid" not in self.session:
            self.handleNotAuthorized()
            return

        parts = self.path.split("/")
        sports_id = parts[2]
        db = SportEventsDB()
        sport = db.getOneSportEvent(sports_id)

        if sport != None:

            # respond to the client
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
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
            self.end_headers()

        else:
            self.handleNotFound()

    def handleNotAuthorized(self):
        self.send_response(401, "Error, Unable to Authenticate")
        self.end_headers()
        self.wfile.write(bytes("Did not work", "utf-8"))

    def HandleDeleteOneEvent(self):
        
        if "userid" not in self.session:
            self.handleNotAuthorized()
            return

        parts = self.path.split("/")
        sport_id = parts[2]
        db = SportEventsDB()
        sport = db.getOneSportEvent(sport_id)

        if sport != None:
            db.DeleteSportEvent(sport_id)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            
        else:
            self.handleNotFound()


def run():

    db = SportEventsDB()
    db.createUserTable()
    db.createSportTable()
    db = None # disconnect

    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])

    listen=("0.0.0.0",port)
    server=HTTPServer(listen, MyRequestHandler)

    print("Server listening on","{}:{}".format(*listen))
    server.serve_forever()

run()


