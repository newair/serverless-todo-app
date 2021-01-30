
import * as AWS from 'aws-sdk';
import * as AWSXray from 'aws-xray-sdk'

export const XAWS: any = process.env.local ? AWS: AWSXray.captureAWS(AWS);
export const docClient = process.env.local ? new XAWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
   })
 : new XAWS.DynamoDB.DocumentClient()

export const TodosTable = 'serverless-todo-app-dep-dev';

export const TodosBucket = 'serverless-todo-app-dep-dev';
