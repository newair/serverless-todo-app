import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils';
import { deleteTodo } from '../persitence/persistence.layer';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
 // const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  let deletedTodo

  // TODO: Remove a TODO item by id

  try {
    deletedTodo = await deleteTodo(todoId, userId);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(error)
    };
  };
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      deletedTodo
    })
  };
}
