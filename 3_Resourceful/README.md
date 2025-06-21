# My Project


## Resource

**Sport Information Tracker**

Attributes:

* League (string)
* Team Name (string)
* Conferance (string)
* Team Rank (integer)
* Location (integer)
* Mascot (integer)

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

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retreive Sport Events          | GET    | /sports
Retrieve One Event             | GET    | /sports/*\<id\>*
Create Sport Events            | POST   | /sports
Update One Event               | PUT    | /sports/*\<id\>*
Delete One EVent               | DELETE | /sports/*\<id\>*
