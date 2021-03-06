import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { getTodos } from '../persitence/persistence.layer'
import { createLogger } from '../../utils/logger'
const logger = createLogger('CreateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  logger.info('GetTodos Event called', event)
  const userId = getUserId(event)

  try {
    const items =  (await getTodos(userId)).Items;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items
      })
    };

  } catch(error){
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(error)
    };
  };

}
