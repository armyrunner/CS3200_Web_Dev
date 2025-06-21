from http.server import BaseHTTPRequestHandler,HTTPServer
from tickets_db import TicketsDB
from http import cookies
from urllib.parse import parse_qs
import json
import random


class MyRequestHandler(BaseHTTPRequestHandler):

    def end_headers(self):
        #self.sendCookie()
        self.send_header("Access-Control-Allow-Origin",self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials","true")
        BaseHTTPRequestHandler.end_headers(self)

    # def loadCookie(self):
    #     if "Cookie" in self.headers:
    #         self.cookie = cookies.SimpleCookie(self.headers["Cookie"])
    #     else:
    #         self.cookie = cookies.SimpleCookie()

    # def sendCookie(self):
    #     for morsel in self.cookie.values():
    #         self.send_header("Set-Cookie",morsel.OutputString())

    def loadSession(self):
        self.loadcookie()
        pass

    def do_OPTiONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Methods","GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers","Content-Type, Content-Length")
        self.end_headers()


    def do_GET(self):
        #self.loadCookie()
        print("The path is",self.path)
        if self.path == "/tickets":
            self.RetrieveTickets()
        elif self.path.startswith("/tickets/"):
            self.RetrieveOneTicket()
        else:
            self.handleNotFound()
    
    def do_POST(self):
       # self.loadCookie()
        if self.path == "/tickets":
            self.CreateGoldenTicket()
        else:
            self.handleNotFound()

    def handleNotFound(self):
        self.send_response(404,"Error, page not found")
        self.end_headers()

    def RetrieveTickets(self):
        self.send_response(200)
        self.send_header("Content-Type","application/json")
        self.end_headers()
        db = TicketsDB()
        tickets = db.getAllTickets()
        self.wfile.write(bytes(json.dumps(tickets),"utf-8"))

    def RetrieveOneTicket(self):
        parts = self.path.split("/")
        self.send_header("Content-Type","application/json")
        self.end_headers()
        ticket_id = parts[2]
        db = TicketsDB()
        ticket = db.getOneTicket(ticket_id)

        if ticket != None:
            self.send_response(200)
            self.send_header("Content-Type","application/json")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(tickets),"utf-8"))
        else:
            self.handleNotFound()
    
    def CreateGoldenTicket(self):
        length = self.headers["Content-Length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        print("Body",body)
        parsed_body = parse_qs(body)
        print("parsed body", parsed_body)

        entrant_name = parsed_body["entrant_name"][0]
        entrant_age = parsed_body["entrant_age"][0]
        guest_name = parsed_body["guest_name"][0]
        random_token = random.randint(0,6)

        db = TicketsDB()
        db.InsertTicket(entrant_name,entrant_age,guest_name,random_token)
        self.send_response(201)
        self.end_headers()

def run():

    listen=("127.0.0.1", 8080)
    server=HTTPServer(listen, MyRequestHandler)

    print("Listening....")
    server.serve_forever()

run()

   




