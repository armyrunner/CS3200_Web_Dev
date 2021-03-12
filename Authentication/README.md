# My Project
This project uses byrcpt to hash the password to keep user information secure.


## Resource

**Sport Information Tracker**

Attributes: Sport Information

* League (string)
* Team Name (string)
* Conferance (string)
* Team Rank (integer)
* Location (integer)
* Mascot (integer)

Attributes: Login Informaiton

* First Name (string)
* Last Name (string)
* Email (string)
* Password (string)

## Schema 

```sql
CREATE TABLE sports (
id INTEGER PRIMARY KEY,
league TEXT,
teamname TEXT,
conferance TEXT,
teamrank TEXT),
location TEXT),
mascot TEXT);
```
```sql
CREATE TABLE Users (
id INTEGER PRIMARY KEY,
Fname TEXT,
Lname TEXT,
Email TEXT,
encpass TEXT);
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retreive Sport Events          | GET    | /sports
Retrieve One Event             | GET    | /sports/*\<id\>*
Create Sport Events            | POST   | /sports
Create User                    | POST   | /Users
Create Create Session          | POST   | /session
Update One Event               | PUT    | /sports/*\<id\>*
Delete One EVent               | DELETE | /sports/*\<id\>*
