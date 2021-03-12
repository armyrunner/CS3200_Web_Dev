# My Project: Willy Wonkas Golden Ticket Management System


## Resource

**Ticket**

Attributes:

* entrant_name (string)
* entrant_age (integer)
* guest_name (string)
* random_token (integer)

## Schema

```sql
CREATE TABLE ticketholder (
id INTEGER PRIMARY KEY,
entrant_name TEXT,
entrant_age INTEGER,
guest_name TEXT,
random_token INTEGER);
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retreive Tickets               | GET    | /sports
Retrieve One Ticket            | GET    | /sports/*\<id\>*
Create Golden Ticket           | POST   | /sports

