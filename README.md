# Skeleton_NodeJS
MVC skeleton of NodeJS. Includes server creation, making backend API call, iterate over list, invoking other scripts & logging.

### Dependency
 * log4js: npm install log4js

### To run
 node NodeServer.js

### Exposed endpoints
 * http://localhost:7001/array     
    + Prints predefined array.
    
 * http://localhost:7001/shellscript
    + Executes DemoScript.sh.
    
 * http://localhost:7001/apicall
    + Body: <br/>
    { <br/>
	      "url": "\<URL\>",  <br/>
	      "method": "\<HTTP method\>",  <br/>
	      "body": { <br/>
		                "\<ele 1\>": "\<ele 1 value\>", <br/>
		                "\<ele 2\>": "\<ele 2 value\>", <br/>
		                "\<ele 3\>": "\<ele 3 value\>", <br/>
	              },  <br/>
	       "expectedStatusCode": \<HTTP Status code\> <br/>
    } <br/>
