import sqlite3

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class RestaurantsDB:
    def __init__(self):
        self.connection = sqlite3.connect("restaurants_db.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()

    def insertRestaurant(self, name, cuisine, hours, rating):
        data = [name, cuisine, hours, rating]
        self.cursor.execute("INSERT INTO restaurants (name, cuisine, hours, rating) VALUES (?, ?, ?, ?)", data)
        self.connection.commit()

    def getRestaurants(self):
        self.cursor.execute("SELECT * FROM restaurants")
        result = self.cursor.fetchall()
        return result

    def getOneRestaurant(self, restaurant_id):
        data = [restaurant_id]
        self.cursor.execute("SELECT * FROM restaurants WHERE id = ?", data)
        result = self.cursor.fetchone()
        return result

