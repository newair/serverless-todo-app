import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodosBucket, XAWS } from '../../config'
import { getUserId } from '../utils'
import { GenerateURLRequest } from '../../requests/GenerateURLRequest'
import { updateAttachmentURLTodo } from '../persitence/persistence.layer'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log(event)
  const userId = getUserId(event);
  const todo: GenerateURLRequest  = JSON.parse(event.body);
  const todoId = event.pathParameters.todoId;
  
  const s3 = new XAWS.S3()
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: TodosBucket,
    Key: todo.fileName,
    ContentType: todo.contentType
  });

  await updateAttachmentURLTodo(userId, todoId, todo);
  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadURL: signedUrl
    })
  };
}
