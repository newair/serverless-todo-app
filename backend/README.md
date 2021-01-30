# serverless-todo-app Server project

## How to run locally

### Install serverless and offline

npm install -g serverless

serverless offline -s dev

### Install dynamodb local

npm install --save serverless-dynamodb-local

### Start server locally

serverless offline -s dev

### Start DB locally

sls dynamodb-local

### Client to connect local server

Add an environment variable called 
change config variable apiEndpoint
http://localhost:4000/dev
