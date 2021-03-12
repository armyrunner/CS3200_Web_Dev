import sqlite3
import psycopg2
import psycopg2.extras
import urllib.parse
import os



#def dict_factory(cursor, row):
#    d = {}
#    for idx, col in enumerate(cursor.description):
#        d[col[0]] = row[idx]
#    return d

class SportEventsDB:

    def __init__(self):
      
        urllib.parse.uses_netloc.append("postgres")
        url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
        
        self.connection = psycopg2.connect(
                cursor_factory = psycopg2.extras.RealDictCursor,
                database = url.path[1:],
                user = url.username,
                password = url.password,
                host = url.hostname,
                port = url.port
                )

        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()


    def insertSportsEvent(self,league,teamname,conferance,teamrank,location,mascot):
        data = [league,teamname,conferance,teamrank,location,mascot]
        self.cursor.execute("INSERT INTO sports (league,teamname,conferance,teamrank,location,mascot) VALUES(%s,%s,%s,%s,%s,%s)",data)
        self.connection.commit()


    def getSportsEvents(self):
        self.cursor.execute("SELECT * FROM sports")
        results = self.cursor.fetchall()
        return results
        
  
    def getOneSportEvent(self,sport_id):
        data = [sport_id]
        self.cursor.execute("SELECT * FROM sports WHERE id = %s",data)
        results = self.cursor.fetchone()
        return results

    def DeleteSportEvent(self,sport_id):
        data = [sport_id]
        self.cursor.execute("DELETE FROM sports WHERE id = %s",data)
        self.connection.commit()
        

    def UpdateSportEvent(self,league,teamname,conferance,teamrank,location,mascot,sport_id):
        data = [league,teamname,conferance,teamrank,location,mascot,sport_id]
        self.cursor.execute("UPDATE sports SET league = %s,teamname = %s,conferance = %s,teamrank = %s,location = %s,mascot = %s WHERE id = %s",data)
        self.connection.commit()

    def insertUserRegistration(self,email,fname,lname,encpass):
        data = [email,fname,lname,encpass]
        self.cursor.execute("INSERT INTO users (fname,lname,email,encpass) VALUES(%s,%s,%s,%s)",data)
        self.connection.commit()

    def getOneUserEmail(self,email):
        data = [email]
        self.cursor.execute("SELECT * FROM users WHERE email = %s",data)
        results = self.cursor.fetchone()
        return results
    
    def createSportTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS sports (id SERIAL PRIMARY KEY, league TEXT,teamname TEXT,conferance TEXT,teamrank TEXT,location TEXT,mascot TEXT)")
        self.connection.commit()

    def createUserTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, fname TEXT,lname TEXT,email TEXT,encpass TEXT)")
        self.connection.commit()


