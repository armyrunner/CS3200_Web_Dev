import sqlite3

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class SportEventsDB:

    def __init__(self):
        # connecting to the data base
        self.connection = sqlite3.connect("sportevents.db")
        self.connection.row_factory = dict_factory

        #goes through the database
        self.cursor = self.connection.cursor()
             
        #create a dictionary from sqlite3

    def insertSportsEvent(self,league,teamname,conferance,teamrank,location,mascot):
        data = [league,teamname,conferance,teamrank,location,mascot]
        self.cursor.execute("INSERT INTO sports (league,teamname,conferance,teamrank,location,mascot) VALUES(?,?,?,?,?,?)",data)
        self.connection.commit()


    def getSportsEvents(self):
        self.cursor.execute("SELECT * FROM sports")
        results = self.cursor.fetchall()
        return results
        
  
    def getOneSportEvent(self,sport_id):
        data = [sport_id]
        self.cursor.execute("SELECT * FROM sports WHERE id = ?",data)
        results = self.cursor.fetchone()
        return results

    def DeleteSportEvent(self,sport_id):
        data = [sport_id]
        self.cursor.execute("DELETE FROM sports WHERE id = ?",data)
        self.connection.commit()
        

    def UpdateSportEvent(self,league,teamname,conferance,teamrank,location,mascot,sport_id):
        data = [league,teamname,conferance,teamrank,location,mascot,sport_id]
        self.cursor.execute("UPDATE sports SET league = ?,teamname = ?,conferance = ?,teamrank = ?,location = ?,mascot = ? WHERE id = ?",data)
        self.connection.commit()

    def insertUserRegistration(self,email,fname,lname,encpass):
        data = [email,fname,lname,encpass]
        self.cursor.execute("INSERT INTO Users (Fname,Fname,Email,encpass) VALUES(?,?,?,?)",data)
        self.connection.commit()

    def getOneUserEmail(self,Email):
        data = [Email]
        self.cursor.execute("SELECT * FROM Users WHERE Email = ?",data)
        results = self.cursor.fetchone()
        return results




    

    












