from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib.parse import parse_qs

# make sure this works
# read the homework assignment and name the data



class MyRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        print("The PATH is:", self.path)

        if self.path == "/sports":

	    # respond accordingly
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")

	    # allow acces the over to other servers
            self.end_headers()

        # write to a file
            fin = open("sportsnames.txt","r")
            SPORTS = []
            for line in fin:
                 line = line.strip()
                 SPORTS.append(line)
            fin.close()
	    # send a body
            self.wfile.write(bytes(json.dumps(SPORTS), "utf-8"))
           

        else:
            self.send_response(404, "Error, page not found")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

    def do_POST(self):
        if self.path == "/sports":

	    # get the content length (in bytes)
            length = self.headers["Content-Length"]

            # read the body to a string
            body = self.rfile.read(int(length)).decode("utf-8")

            # pritn the body as a string
            print("Body: ", body)

            # parsed body prints a list of dictionary
            # parse_qs decodes for us to use
            parsed_body = parse_qs(body)
            name = parsed_body["venue"][0]
            # print(name)

            # SPORTS = []
            
            # fin = open("sportsnames.txt","a")
            with open("sportsnames.txt", "a") as myfile:
                myfile.write(name + "\n")

            myfile.close()

            # respond to the client
            self.send_response(201)
            self.send_header("Access-Control-Allow-Origin", "*")
            # allows acces to other domains
            # google reade CORS monzilla stop at flight request
            self.end_headers()
        else:
            self.send_response(404, "Error, page not found")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

# end of class fucntion


def run():

    listen=("127.0.0.1", 8080)
    server=HTTPServer(listen, MyRequestHandler)

    print("Listening....")
    server.serve_forever()

run()
