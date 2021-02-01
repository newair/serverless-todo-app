import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { v4 as uuid  } from 'uuid'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'
import { createTotoPersistence } from '../persitence/persistence.layer'
import { createLogger } from '../../utils/logger'
const logger = createLogger('CreateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Create Todo Event called', event)
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  let newTodoPersistable: TodoItem = {
    ...newTodo,
    userId: userId,
    todoId: uuid(),
    attachmentUrl: null,
    done: true,
    createdAt: null,
  }

  newTodoPersistable = await createTotoPersistence(newTodoPersistable)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newTodoPersistable
    })
  }
}
