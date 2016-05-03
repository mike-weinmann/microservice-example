# Microservice Sample

This project provides a sample REST API for managing records. It is an example project written
in Node.js, without any dependencies. 

While not production level, I did try to use good software engineering principles to create 
an application of realistic complexity, even if the implementations is only suitable for a "playground".

## API

### Authentication

The authentication API creates (login) and terminates (logout) users sessions.

####login

Send username/password credentials. If valid then `200` (OK) with the `x-access-token` that should be included
as a header with all subsequent HTTP requests. All other API calls will return a `403` (Forbidden) if
the `x-access-token` is missing or does reference valid user session.

#####Request

    POST /v1/auth/login

    { 
      "username": "admin",
      "password": "secret"
    }

#####Response
    { 
      "username": "admin",
      "x-access-token": "1234"
     }  
     
####logout

Invalidate user session associated with `x-access-token`. Like with all other requests, the `x-access-token` should
be send an HTTP header.

#####Request

    POST /v1/auth/logout


#####Response


###Configurations

####list

Gets all registered `Configuration` objects. Returns a JSON object with a `configurations` array.

#####Parameters
The request supports the following query parameters for sorting and pagination.

* `sort` - Comma separated list of fields to sort. Prefix field name with minus (-) to reverse sort on that field
* `limit` - Maximum number of records to return
* `start` - Zero-based offset of the first record to return.

Invalid or unknown fields are ignored.

#####Request

    GET /v1/configurations?sort=-username,port&limit=2&start=3
    
#####Response
    
    {
        "configurations": [
            {
                "name": "host1",
                "hostname" : "nessus-ntp.lab.com",
                "port": 1241,
                "username": "toto"
            },
            {
                "name": "host2",
                "hostname" : "nessus-xml.lab.com",
                "port": 3384,
                "username": "admin"
            },
        ]
    }
    
####Get

Returns the record with the specified name with status code of `200` (OK). If no record matches, then
a `404` (Not found) is returned.


#####Request

    GET /v1/configurations/host1
    
#####Response
    
    {
        "name": "host1",
        "hostname" : "nessus-ntp.lab.com",
        "port": 1241,
        "username": "toto"
    }
    

####Create/Modify

The API only supports the PUT operation, since the `name` cannot be generated. The body 
should include the `name`, `hostname`, `port`, and `username` properties. The `name` and `username`
properties are redundant as the `name` is part of the URL and the `username` is populated from
the currently logged in user.

The following validations are performed.
* All fields ( are required.
* `port` must be valid integer between 0 and 19999.

#####Request

    PUT /v1/configurations/host1
    
    {
        "name": "host1",
        "hostname" : "nessus-ntp.lab.com",
        "port": 1241,
        "username": "toto"
    }

#####Response

The HTTP status code will be `204` (No content) for updates of existing records and `200` (OK) for new
records with the response body having the contents of the newly created configuration item.

    {
        "name": "host1",
        "hostname" : "nessus-ntp.lab.com",
        "port": 1241,
        "username": "toto"
    }

####Delete

Deletes the record. Returns `204` (No content) if deleted or `404` (Not found) if the record did not exist.
#####Request

    DELETE /v1/configurations/host1
    

#####Response


## Application

This sample application uses Node with no other libraries. This means that the application contains
infrastructure pieces that would likely be performed by third-party or proven in-house libraries in
a production environment. For example:

* `RouteDispatcher` is a simple request router. Routes handlers are added similar to how Express middleware works.
* `FileRepository` is a file based JSON store used in place of a database. It does not support multi-process locking so it only works in a single process.
* Various small utility methods for things like:
  - Reading the HTTP request body
  - Copying files
  - Sorting objects based on properties
  - etc.

###Controllers and Services

`Controllers` are used to manage the HTTP requests. Their primary responsibility is parse incoming requests, call one or
more services, and format the results on the HTTP response. They have no business logic. Controllers include
HTTP route mapping to their methods. Since HTTP request routing is tightly coupled to the handler, it made sense
to keep these in the same class.

`Services` provide the application logic and should have no vestiges of a web application. In theory, they could
 be used by a different consumer outside of the rest application. In a product environment, the `Service` modules
 and supporting objects could be published as an independent library.


###Configuration

The `config.js` manages the dependencies among the modules. In general, modules are passed instances of 
their dependencies. Without a dependency injection framework, the `config.js` just creates the instances
and sets properties in "map" objects that passed to a module.

####Data Files
The following data files are used by the application:

* `conf/data/users.json` contains the valid users that can be used for authentication.
* `conf/data/configurations.json` contains the list of registered `Configuration` object. This file is updated by the application.

###Environment

Application was tested on a server with the following.

* Node v5.2.0
* Windows 10

The major "new" features of JavaScript that are used:

* `Promises` - All asynchronous (or potentially asynchronous) code returns a `Promise` rather than using callbacks.
* `Object.assign` - Is used to provide similar behavior to `_.extend`
   
## Testing

The `TestRunner` is a simple class to run unit/automated tests. All of the `Service` modules and their dependencies
have automated tests.

The `Controllers` currently do not have service side unit tests. The `Controllers` are designed so that
each route handler is exposed for testing. The only thing that is missing is test (e.g., mock) instances
of the HTTP request and response object.

Instead of creating a web testing framework, it seemed more important to actually the test the complete application.
To that end, a simple (and quite ugly) `test.html` is used to test the API against the running application.  
