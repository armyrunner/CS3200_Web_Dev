import sqlite3

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


class TicketsDB:

    def __init__(self):

        self.connection = sqlite3.connect("tickets.db")
        self.connection.row_factory = dict_factory

        self.cursor = self.connection.cursor()

    def InsertTicket(self, entrant_name,entrant_age, guest_name,random_token):

        data = [ entrant_name,entrant_age, guest_name,random_token]
        self.cursor.execute("INSERT INTO ticketholder(entrant_name,entrant_age,guest_name,random_token) VALUES(?,?,?,?)",data)
        self.connection.commit()
    
    def getAllTickets(self):
        self.cursor.execute("SELECT * FROM ticketholder")
        results = self.cursor.fetchall()
        return results

    def getOneTicket(self,ticket_id):
        data = [ticket_id]
        self.cursor.execute("SELECT * FROM ticketholder WHERE id = ?",data)
        results = self.cursor.fetchone()
        return results
    
    def createTicketDB(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS ticketholder(id INTEGER PRIMARY KEY, entrant_name TEXT, entrant_age INTEGER ,guest_name TEXT ,random_token INTEGER")
        self.connection.commit()
    
